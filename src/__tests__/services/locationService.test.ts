import LocationService from '../../services/locationService';
import * as Location from 'expo-location';

// Get the mocked module
jest.mock('expo-location');

describe('LocationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkPermission', () => {
    it('should return true when permission is granted', async () => {
      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const result = await LocationService.checkPermission();

      expect(result).toBe(true);
      expect(Location.getForegroundPermissionsAsync).toHaveBeenCalled();
    });

    it('should return false when permission is denied', async () => {
      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const result = await LocationService.checkPermission();

      expect(result).toBe(false);
    });

    it('should return false when checking permission throws an error', async () => {
      (Location.getForegroundPermissionsAsync as jest.Mock).mockRejectedValue(
        new Error('Permission check failed')
      );

      const result = await LocationService.checkPermission();

      expect(result).toBe(false);
    });
  });

  describe('requestPermissions', () => {
    it('should return true when foreground and background permissions are granted', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Location.requestBackgroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const result = await LocationService.requestPermissions();

      expect(result).toBe(true);
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
    });

    it('should return false when foreground permission is denied', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const result = await LocationService.requestPermissions();

      expect(result).toBe(false);
    });

    it('should return true even if background permission fails (Expo Go limitation)', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Location.requestBackgroundPermissionsAsync as jest.Mock).mockRejectedValue(
        new Error('Not available in Expo Go')
      );

      const result = await LocationService.requestPermissions();

      expect(result).toBe(true);
    });
  });

  describe('startTracking', () => {
    it('should start location tracking successfully', async () => {
      const mockCallback = jest.fn();
      const mockSubscription = { remove: jest.fn() };
      
      (Location.watchPositionAsync as jest.Mock).mockResolvedValue(mockSubscription);

      await LocationService.startTracking(mockCallback);

      expect(Location.watchPositionAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 0,
        }),
        expect.any(Function)
      );
    });

    it('should call callback with location data', async () => {
      const mockCallback = jest.fn();
      const mockLocation = {
        coords: {
          latitude: 37.7749,
          longitude: -122.4194,
          altitude: 10,
          accuracy: 5,
          heading: 0,
          speed: 0,
        },
        timestamp: Date.now(),
      };

      (Location.watchPositionAsync as jest.Mock).mockImplementation(
        async (options, callback) => {
          callback(mockLocation);
          return { remove: jest.fn() };
        }
      );

      await LocationService.startTracking(mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(mockLocation);
    });

    it('should throw error when tracking fails to start', async () => {
      const mockCallback = jest.fn();
      
      (Location.watchPositionAsync as jest.Mock).mockRejectedValue(
        new Error('Location tracking failed')
      );

      await expect(LocationService.startTracking(mockCallback)).rejects.toThrow(
        'Location tracking failed'
      );
    });
  });

  describe('stopTracking', () => {
    it('should stop location tracking', async () => {
      const mockRemove = jest.fn();
      const mockSubscription = { remove: mockRemove };
      
      (Location.watchPositionAsync as jest.Mock).mockResolvedValue(mockSubscription);

      // Start tracking first
      await LocationService.startTracking(jest.fn());
      
      // Then stop
      LocationService.stopTracking();

      expect(mockRemove).toHaveBeenCalled();
    });

    it('should not throw when stopping without active tracking', () => {
      expect(() => LocationService.stopTracking()).not.toThrow();
    });
  });
});
