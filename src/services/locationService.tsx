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
  async startTracking(callback: (location: Location.LocationObject) => void) {

    this.locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High, // Uses GPS
        timeInterval: 1000, // Update every second
      },
      (location) => {
        callback(location);
      }
    );
    
  }

  // Stop tracking
  stopTracking() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  // Get current position (one-time)
  async getCurrentPosition(): Promise<Location.LocationObject> {
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
  }
}

export default new LocationService();