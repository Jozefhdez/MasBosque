import * as SQLite from 'expo-sqlite';
import { logger } from '../utils/logger';

export type PendingProfileUpdate = {
  id?: number;
  user_id: string;
  name?: string;
  last_name?: string;
  photo_url?: string;
  allergies?: string; // JSON stringified array
  created_at: number;
  retry_count: number;
  last_error?: string;
};

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize() {
    try {
      if (this.db) {
        logger.log('[DatabaseService] Database already initialized');
        return;
      }

      this.db = await SQLite.openDatabaseAsync('masbosque.db');
      
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS pending_profile_updates (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          name TEXT,
          last_name TEXT,
          photo_url TEXT,
          allergies TEXT,
          created_at INTEGER NOT NULL,
          retry_count INTEGER DEFAULT 0,
          last_error TEXT
        );
      `);

      logger.log('[DatabaseService] Database initialized successfully');
    } catch (error) {
      logger.error('[DatabaseService] Error initializing database:', error);
      throw error;
    }
  }

  async savePendingUpdate(update: Omit<PendingProfileUpdate, 'id'>): Promise<void> {
    try {
      if (!this.db) {
        await this.initialize();
      }

      // Check if there's already a pending update for this user
      const existing = await this.db!.getFirstAsync<PendingProfileUpdate>(
        'SELECT * FROM pending_profile_updates WHERE user_id = ? LIMIT 1',
        [update.user_id]
      );

      if (existing) {
        // Update the existing record with new data
        await this.db!.runAsync(
          `UPDATE pending_profile_updates 
           SET name = ?, last_name = ?, photo_url = ?, allergies = ?, 
               created_at = ?, retry_count = ?, last_error = ?
           WHERE user_id = ?`,
          [
            update.name ?? existing.name ?? null,
            update.last_name ?? existing.last_name ?? null,
            update.photo_url ?? existing.photo_url ?? null,
            update.allergies ?? existing.allergies ?? null,
            update.created_at,
            update.retry_count,
            update.last_error ?? null,
            update.user_id
          ]
        );
        logger.log('[DatabaseService] Updated existing pending update for user:', update.user_id);
      } else {
        // Insert new record
        await this.db!.runAsync(
          `INSERT INTO pending_profile_updates 
           (user_id, name, last_name, photo_url, allergies, created_at, retry_count, last_error)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            update.user_id,
            update.name || null,
            update.last_name || null,
            update.photo_url || null,
            update.allergies || null,
            update.created_at,
            update.retry_count,
            update.last_error || null
          ]
        );
        logger.log('[DatabaseService] Saved new pending update for user:', update.user_id);
      }
    } catch (error) {
      logger.error('[DatabaseService] Error saving pending update:', error);
      throw error;
    }
  }

  async getPendingUpdates(): Promise<PendingProfileUpdate[]> {
    try {
      if (!this.db) {
        await this.initialize();
      }

      const updates = await this.db!.getAllAsync<PendingProfileUpdate>(
        'SELECT * FROM pending_profile_updates ORDER BY created_at ASC'
      );

      logger.log(`[DatabaseService] Retrieved ${updates.length} pending updates`);
      return updates;
    } catch (error) {
      logger.error('[DatabaseService] Error getting pending updates:', error);
      return [];
    }
  }

  async deletePendingUpdate(id: number): Promise<void> {
    try {
      if (!this.db) {
        await this.initialize();
      }

      await this.db!.runAsync('DELETE FROM pending_profile_updates WHERE id = ?', [id]);
      logger.log('[DatabaseService] Deleted pending update with id:', id);
    } catch (error) {
      logger.error('[DatabaseService] Error deleting pending update:', error);
      throw error;
    }
  }

  async updateRetryCount(id: number, retryCount: number, lastError?: string): Promise<void> {
    try {
      if (!this.db) {
        await this.initialize();
      }

      await this.db!.runAsync(
        'UPDATE pending_profile_updates SET retry_count = ?, last_error = ? WHERE id = ?',
        [retryCount, lastError || null, id]
      );
      logger.log(`[DatabaseService] Updated retry count to ${retryCount} for id:`, id);
    } catch (error) {
      logger.error('[DatabaseService] Error updating retry count:', error);
      throw error;
    }
  }

  async clearAllPendingUpdates(): Promise<void> {
    try {
      if (!this.db) {
        await this.initialize();
      }

      await this.db!.runAsync('DELETE FROM pending_profile_updates');
      logger.log('[DatabaseService] Cleared all pending updates');
    } catch (error) {
      logger.error('[DatabaseService] Error clearing pending updates:', error);
      throw error;
    }
  }

  async getPendingUpdateByUserId(userId: string): Promise<PendingProfileUpdate | null> {
    try {
      if (!this.db) {
        await this.initialize();
      }

      const update = await this.db!.getFirstAsync<PendingProfileUpdate>(
        'SELECT * FROM pending_profile_updates WHERE user_id = ? LIMIT 1',
        [userId]
      );

      return update || null;
    } catch (error) {
      logger.error('[DatabaseService] Error getting pending update by user id:', error);
      return null;
    }
  }
}

export const databaseService = new DatabaseService();
