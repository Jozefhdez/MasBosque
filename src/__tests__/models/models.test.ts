import { UserProfile } from '../../models/userProfileModel';
import { UserAllergies } from '../../models/userAllergiesModel';

describe('Models', () => {
  describe('UserProfile', () => {
    it('should have correct structure with required fields', () => {
      const profile: UserProfile = {
        id: 'user-123',
        name: 'John',
        last_name: 'Doe',
        role: 'user',
        is_completed: true,
      };

      expect(profile).toHaveProperty('id');
      expect(profile).toHaveProperty('name');
      expect(profile).toHaveProperty('last_name');
      expect(profile).toHaveProperty('role');
      expect(profile).toHaveProperty('is_completed');
    });

    it('should support optional photo_url', () => {
      const profileWithPhoto: UserProfile = {
        id: 'user-123',
        name: 'John',
        last_name: 'Doe',
        role: 'user',
        is_completed: true,
        photo_url: 'https://example.com/photo.jpg',
      };

      expect(profileWithPhoto.photo_url).toBe('https://example.com/photo.jpg');

      const profileWithoutPhoto: UserProfile = {
        id: 'user-456',
        name: 'Jane',
        last_name: 'Doe',
        role: 'admin',
        is_completed: false,
      };

      expect(profileWithoutPhoto.photo_url).toBeUndefined();
    });

    it('should have correct value types', () => {
      const profile: UserProfile = {
        id: 'user-123',
        name: 'John',
        last_name: 'Doe',
        role: 'user',
        is_completed: false,
      };

      expect(typeof profile.id).toBe('string');
      expect(typeof profile.name).toBe('string');
      expect(typeof profile.last_name).toBe('string');
      expect(typeof profile.role).toBe('string');
      expect(typeof profile.is_completed).toBe('boolean');
    });

    it('should support different roles', () => {
      const userProfile: UserProfile = {
        id: '1',
        name: 'User',
        last_name: 'Test',
        role: 'user',
        is_completed: true,
      };

      const adminProfile: UserProfile = {
        id: '2',
        name: 'Admin',
        last_name: 'Test',
        role: 'admin',
        is_completed: true,
      };

      expect(userProfile.role).toBe('user');
      expect(adminProfile.role).toBe('admin');
    });
  });

  describe('UserAllergies', () => {
    it('should have correct structure', () => {
      const allergy: UserAllergies = {
        id: 'allergy-1',
        profile_id: 'user-123',
        description: 'Peanuts',
      };

      expect(allergy).toHaveProperty('id');
      expect(allergy).toHaveProperty('profile_id');
      expect(allergy).toHaveProperty('description');
    });

    it('should have correct value types', () => {
      const allergy: UserAllergies = {
        id: 'allergy-1',
        profile_id: 'user-123',
        description: 'Shellfish',
      };

      expect(typeof allergy.id).toBe('string');
      expect(typeof allergy.profile_id).toBe('string');
      expect(typeof allergy.description).toBe('string');
    });

    it('should support various allergy descriptions', () => {
      const allergies: UserAllergies[] = [
        { id: '1', profile_id: 'user-1', description: 'Peanuts' },
        { id: '2', profile_id: 'user-1', description: 'Tree Nuts' },
        { id: '3', profile_id: 'user-1', description: 'Dairy' },
        { id: '4', profile_id: 'user-1', description: 'Gluten' },
        { id: '5', profile_id: 'user-1', description: 'Eggs' },
      ];

      expect(allergies).toHaveLength(5);
      allergies.forEach(allergy => {
        expect(allergy.profile_id).toBe('user-1');
        expect(allergy.description).toBeTruthy();
      });
    });

    it('should link to user profile via profile_id', () => {
      const userId = 'user-123';
      
      const allergy1: UserAllergies = {
        id: 'allergy-1',
        profile_id: userId,
        description: 'Peanuts',
      };

      const allergy2: UserAllergies = {
        id: 'allergy-2',
        profile_id: userId,
        description: 'Shellfish',
      };

      expect(allergy1.profile_id).toBe(userId);
      expect(allergy2.profile_id).toBe(userId);
    });
  });
});
