import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { logger } from '../utils/logger';

class LocationService {
  private locationSubscription: Location.LocationSubscription | null = null;

  // Check current permission status
  async checkPermission(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      logger.warn('[Location Service] Error checking permissions (possibly Expo Go limitation):', error);
      return false;
    }
  }

  // Request location permissions
  async requestPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      return false;
    }

    // For background tracking (optional)
    // Skip background permissions in Expo Go as they're not supported
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      try {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        return backgroundStatus === 'granted';
      } catch (error) {
        logger.warn('[Location Service] Background permissions not available (possibly running in Expo Go)', error);
        return true;
      }
    }

    return true;
  }

  // Start tracking location (works offline with GPS)
  async startTracking(callback: (location: Location.LocationObject) => void): Promise<void> {
    try {
      // Stop any existing subscription first
      this.stopTracking();

      logger.info('[Location Service] Starting location tracking');
      
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High, // Uses GPS
          timeInterval: 1000, // Update every second
          distanceInterval: 0, // Update on any movement
        },
        (location) => {
          callback(location);
        }
      );
      
      logger.info('[Location Service] Location tracking started successfully');
    } catch (error) {
      logger.error('[Location Service] Error starting location tracking:', error);
      throw error;
    }
  }

  // Stop tracking
  stopTracking(): void {
    if (this.locationSubscription) {
      try {
        this.locationSubscription.remove();
        this.locationSubscription = null;
        logger.info('[Location Service] Location tracking stopped');
      } catch (error) {
        logger.error('[Location Service] Error stopping location tracking:', error);
        // Still set to null to prevent memory leaks
        this.locationSubscription = null;
      }
    }
  }
}

export default new LocationService();