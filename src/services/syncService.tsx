import { databaseService, PendingProfileUpdate } from './databaseService';
import { supabase } from './supabaseClient';
import { logger } from '../utils/logger';
import { UserAllergies } from '../models/userAllergiesModel';

const MAX_RETRIES = 5;

class SyncService {
  private isSyncing = false;

  async syncPendingUpdates(): Promise<boolean> {
    if (this.isSyncing) {
      logger.log('[SyncService] Sync already in progress, skipping...');
      return false;
    }

    this.isSyncing = true;

    try {
      logger.log('[SyncService] Starting sync of pending updates...');
      
      const pendingUpdates = await databaseService.getPendingUpdates();
      
      if (pendingUpdates.length === 0) {
        logger.log('[SyncService] No pending updates to sync');
        this.isSyncing = false;
        return true;
      }

      logger.log(`[SyncService] Found ${pendingUpdates.length} pending update(s) to sync`);

      let allSuccess = true;

      for (const update of pendingUpdates) {
        const success = await this.syncSingleUpdate(update);
        if (!success) {
          allSuccess = false;
        }
      }

      this.isSyncing = false;
      return allSuccess;
    } catch (error) {
      logger.error('[SyncService] Error during sync:', error);
      this.isSyncing = false;
      return false;
    }
  }

  private async syncSingleUpdate(update: PendingProfileUpdate): Promise<boolean> {
    try {
      logger.log(`[SyncService] Attempting to sync update for user: ${update.user_id}`);

      // Check if we've exceeded max retries
      if (update.retry_count >= MAX_RETRIES) {
        logger.warn(`[SyncService] Max retries (${MAX_RETRIES}) reached for update id: ${update.id}. Keeping in queue.`);
        return false;
      }

      // Prepare the update object
      const profileUpdate: any = {};
      
      if (update.name) profileUpdate.name = update.name;
      if (update.last_name) profileUpdate.last_name = update.last_name;
      if (update.photo_url) profileUpdate.photo_url = update.photo_url;

      // Update profile if there are profile changes
      if (Object.keys(profileUpdate).length > 0) {
        const { error: profileError } = await supabase
          .from('users')
          .update(profileUpdate)
          .eq('id', update.user_id);
        
        if (profileError) {
          throw new Error(`Profile update failed: ${profileError.message}`);
        }
        logger.log('[SyncService] Profile updated successfully');
      }

      // Handle allergies if present
      if (update.allergies) {
        try {
          const allergiesData: {
            existing: UserAllergies[];
            new: Array<{ description: string }>;
            deleted: string[];
          } = JSON.parse(update.allergies);

          // Delete removed allergies
          if (allergiesData.deleted && allergiesData.deleted.length > 0) {
            for (const allergyId of allergiesData.deleted) {
              const { error: deleteError } = await supabase
                .from('allergies')
                .delete()
                .eq('id', allergyId);

              if (deleteError) {
                logger.error('[SyncService] Error deleting allergy:', deleteError);
              }
            }
            logger.log(`[SyncService] Deleted ${allergiesData.deleted.length} allergies`);
          }

          // Update existing allergies
          if (allergiesData.existing && allergiesData.existing.length > 0) {
            for (const allergy of allergiesData.existing) {
              const { error: updateError } = await supabase
                .from('allergies')
                .update({ description: allergy.description })
                .eq('id', allergy.id);
              
              if (updateError) {
                logger.error('[SyncService] Error updating allergy:', updateError);
              }
            }
            logger.log(`[SyncService] Updated ${allergiesData.existing.length} allergies`);
          }

          // Insert new allergies
          if (allergiesData.new && allergiesData.new.length > 0) {
            for (const allergy of allergiesData.new) {
              const { error: insertError } = await supabase
                .from('allergies')
                .insert({
                  profile_id: update.user_id,
                  description: allergy.description
                });

              if (insertError) {
                logger.error('[SyncService] Error inserting allergy:', insertError);
              }
            }
            logger.log(`[SyncService] Inserted ${allergiesData.new.length} new allergies`);
          }
        } catch (parseError) {
          logger.error('[SyncService] Error parsing allergies data:', parseError);
        }
      }

      // Successfully synced, remove from queue
      if (update.id) {
        await databaseService.deletePendingUpdate(update.id);
        logger.log(`[SyncService] Successfully synced and removed update id: ${update.id}`);
      }

      return true;
    } catch (error) {
      logger.error('[SyncService] Error syncing update:', error);
      
      // Increment retry count
      if (update.id) {
        const newRetryCount = update.retry_count + 1;
        const errorMessage = (error as any)?.message || 'Unknown error';
        await databaseService.updateRetryCount(update.id, newRetryCount, errorMessage);
        logger.log(`[SyncService] Updated retry count to ${newRetryCount} for update id: ${update.id}`);
      }

      return false;
    }
  }

  async hasPendingUpdates(): Promise<boolean> {
    try {
      const updates = await databaseService.getPendingUpdates();
      return updates.length > 0;
    } catch (error) {
      logger.error('[SyncService] Error checking for pending updates:', error);
      return false;
    }
  }

  async getPendingUpdatesCount(): Promise<number> {
    try {
      const updates = await databaseService.getPendingUpdates();
      return updates.length;
    } catch (error) {
      logger.error('[SyncService] Error getting pending updates count:', error);
      return 0;
    }
  }
}

export const syncService = new SyncService();
