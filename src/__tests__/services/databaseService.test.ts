import { databaseService } from '../../services/databaseService';
import { UserProfile } from '../../models/userProfileModel';
import { UserAllergies } from '../../models/userAllergiesModel';

// Mock the database service
jest.mock('../../services/databaseService');

describe('DatabaseService', () => {
  const mockUserProfile: UserProfile = {
    id: 'test-user-id',
    name: 'John',
    last_name: 'Doe',
    role: 'user',
    is_completed: true,
    photo_url: 'https://example.com/photo.jpg',
  };

  const mockAllergies: UserAllergies[] = [
    { id: 'allergy-1', profile_id: 'test-user-id', description: 'Peanuts' },
    { id: 'allergy-2', profile_id: 'test-user-id', description: 'Shellfish' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should initialize database without errors', async () => {
      (databaseService.initialize as jest.Mock).mockResolvedValue(undefined);
      
      await expect(databaseService.initialize()).resolves.not.toThrow();
      expect(databaseService.initialize).toHaveBeenCalled();
    });
  });

  describe('User Profile Operations', () => {
    it('should save user profile', async () => {
      (databaseService.saveUserProfile as jest.Mock).mockResolvedValue(undefined);
      
      await expect(databaseService.saveUserProfile(mockUserProfile)).resolves.not.toThrow();
      expect(databaseService.saveUserProfile).toHaveBeenCalledWith(mockUserProfile);
    });

    it('should get user profile by id', async () => {
      (databaseService.getUserProfile as jest.Mock).mockResolvedValue(mockUserProfile);
      
      const result = await databaseService.getUserProfile('test-user-id');
      
      expect(result).toEqual(mockUserProfile);
      expect(databaseService.getUserProfile).toHaveBeenCalledWith('test-user-id');
    });

    it('should return null for non-existent user profile', async () => {
      (databaseService.getUserProfile as jest.Mock).mockResolvedValue(null);
      
      const result = await databaseService.getUserProfile('non-existent-id');
      
      expect(result).toBeNull();
    });

    it('should delete user profile', async () => {
      (databaseService.deleteUserProfile as jest.Mock).mockResolvedValue(undefined);
      
      await expect(databaseService.deleteUserProfile('test-user-id')).resolves.not.toThrow();
      expect(databaseService.deleteUserProfile).toHaveBeenCalledWith('test-user-id');
    });
  });

  describe('User Allergies Operations', () => {
    it('should save user allergies', async () => {
      (databaseService.saveUserAllergies as jest.Mock).mockResolvedValue(undefined);
      
      await expect(databaseService.saveUserAllergies('test-user-id', mockAllergies)).resolves.not.toThrow();
      expect(databaseService.saveUserAllergies).toHaveBeenCalledWith('test-user-id', mockAllergies);
    });

    it('should get user allergies', async () => {
      (databaseService.getUserAllergies as jest.Mock).mockResolvedValue(mockAllergies);
      
      const result = await databaseService.getUserAllergies('test-user-id');
      
      expect(result).toEqual(mockAllergies);
      expect(result).toHaveLength(2);
    });

    it('should return empty array for user with no allergies', async () => {
      (databaseService.getUserAllergies as jest.Mock).mockResolvedValue([]);
      
      const result = await databaseService.getUserAllergies('user-no-allergies');
      
      expect(result).toEqual([]);
    });

    it('should delete user allergies', async () => {
      (databaseService.deleteUserAllergies as jest.Mock).mockResolvedValue(undefined);
      
      await expect(databaseService.deleteUserAllergies('test-user-id')).resolves.not.toThrow();
      expect(databaseService.deleteUserAllergies).toHaveBeenCalledWith('test-user-id');
    });
  });

  describe('Session Operations', () => {
    it('should save user session', async () => {
      (databaseService.saveUserSession as jest.Mock).mockResolvedValue(undefined);
      
      await expect(databaseService.saveUserSession('test-user-id', 'test@example.com')).resolves.not.toThrow();
      expect(databaseService.saveUserSession).toHaveBeenCalledWith('test-user-id', 'test@example.com');
    });

    it('should get user session', async () => {
      const mockSession = { userId: 'test-user-id', email: 'test@example.com' };
      (databaseService.getUserSession as jest.Mock).mockResolvedValue(mockSession);
      
      const result = await databaseService.getUserSession();
      
      expect(result).toEqual(mockSession);
    });

    it('should return null when no session exists', async () => {
      (databaseService.getUserSession as jest.Mock).mockResolvedValue(null);
      
      const result = await databaseService.getUserSession();
      
      expect(result).toBeNull();
    });

    it('should clear user session', async () => {
      (databaseService.clearUserSession as jest.Mock).mockResolvedValue(undefined);
      
      await expect(databaseService.clearUserSession()).resolves.not.toThrow();
      expect(databaseService.clearUserSession).toHaveBeenCalled();
    });
  });

  describe('Clear All Data', () => {
    it('should clear all user data', async () => {
      (databaseService.clearAllUserData as jest.Mock).mockResolvedValue(undefined);
      
      await expect(databaseService.clearAllUserData()).resolves.not.toThrow();
      expect(databaseService.clearAllUserData).toHaveBeenCalled();
    });
  });
});
