import * as SQLite from 'expo-sqlite';
import { logger } from '../utils/logger';
import { UserProfile } from '../models/userProfileModel';
import { UserAllergies } from '../models/userAllergiesModel';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize() {
    try {
      if (this.db) {
        logger.log('[DatabaseService] Database already initialized');
        return;
      }

      this.db = await SQLite.openDatabaseAsync('masbosque.db');
      
      // Create user profile table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS user_profile (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          role TEXT NOT NULL,
          is_completed INTEGER NOT NULL DEFAULT 0,
          photo_url TEXT
        );
      `);

      // Create user allergies table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS user_allergies (
          id TEXT PRIMARY KEY,
          profile_id TEXT NOT NULL,
          description TEXT NOT NULL,
          FOREIGN KEY (profile_id) REFERENCES user_profile (id) ON DELETE CASCADE
        );
      `);

      // Drop old pending_profile_updates table if it exists
      await this.db.execAsync(`
        DROP TABLE IF EXISTS pending_profile_updates;
      `);

      logger.log('[DatabaseService] Database initialized successfully');
    } catch (error) {
      logger.error('[DatabaseService] Error initializing database:', error);
      throw error;
    }
  }

  // User Profile operations
  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      if (!this.db) {
        await this.initialize();
      }

      await this.db!.runAsync(
        `INSERT OR REPLACE INTO user_profile (id, name, last_name, role, is_completed, photo_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          profile.id,
          profile.name,
          profile.last_name,
          profile.role,
          profile.is_completed ? 1 : 0,
          profile.photo_url || null
        ]
      );
      logger.log('[DatabaseService] User profile saved:', profile.id);
    } catch (error) {
      logger.error('[DatabaseService] Error saving user profile:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      if (!this.db) {
        await this.initialize();
      }

      const profile = await this.db!.getFirstAsync<any>(
        'SELECT * FROM user_profile WHERE id = ? LIMIT 1',
        [userId]
      );

      if (!profile) {
        return null;
      }

      return {
        id: profile.id,
        name: profile.name,
        last_name: profile.last_name,
        role: profile.role,
        is_completed: profile.is_completed === 1,
        photo_url: profile.photo_url
      };
    } catch (error) {
      logger.error('[DatabaseService] Error getting user profile:', error);
      return null;
    }
  }

  async deleteUserProfile(userId: string): Promise<void> {
    try {
      if (!this.db) {
        await this.initialize();
      }

      await this.db!.runAsync('DELETE FROM user_profile WHERE id = ?', [userId]);
      logger.log('[DatabaseService] User profile deleted:', userId);
    } catch (error) {
      logger.error('[DatabaseService] Error deleting user profile:', error);
      throw error;
    }
  }

  // User Allergies operations
  async saveUserAllergies(userId: string, allergies: UserAllergies[]): Promise<void> {
    try {
      if (!this.db) {
        await this.initialize();
      }

      // Delete existing allergies for this user
      await this.db!.runAsync('DELETE FROM user_allergies WHERE profile_id = ?', [userId]);

      // Insert new allergies using INSERT OR REPLACE to handle duplicates
      for (const allergy of allergies) {
        await this.db!.runAsync(
          `INSERT OR REPLACE INTO user_allergies (id, profile_id, description)
           VALUES (?, ?, ?)`,
          [allergy.id, allergy.profile_id, allergy.description]
        );
      }
      logger.log('[DatabaseService] User allergies saved:', allergies.length);
    } catch (error) {
      logger.error('[DatabaseService] Error saving user allergies:', error);
      throw error;
    }
  }

  async getUserAllergies(userId: string): Promise<UserAllergies[]> {
    try {
      if (!this.db) {
        await this.initialize();
      }

      const allergies = await this.db!.getAllAsync<UserAllergies>(
        'SELECT * FROM user_allergies WHERE profile_id = ?',
        [userId]
      );

      return allergies || [];
    } catch (error) {
      logger.error('[DatabaseService] Error getting user allergies:', error);
      return [];
    }
  }

  async deleteUserAllergies(userId: string): Promise<void> {
    try {
      if (!this.db) {
        await this.initialize();
      }

      await this.db!.runAsync('DELETE FROM user_allergies WHERE profile_id = ?', [userId]);
      logger.log('[DatabaseService] User allergies deleted for user:', userId);
    } catch (error) {
      logger.error('[DatabaseService] Error deleting user allergies:', error);
      throw error;
    }
  }

  async clearAllUserData(): Promise<void> {
    try {
      if (!this.db) {
        await this.initialize();
      }

      await this.db!.runAsync('DELETE FROM user_allergies');
      await this.db!.runAsync('DELETE FROM user_profile');
      logger.log('[DatabaseService] All user data cleared');
    } catch (error) {
      logger.error('[DatabaseService] Error clearing user data:', error);
      throw error;
    }
  }
}

export const databaseService = new DatabaseService();
