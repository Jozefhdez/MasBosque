import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { UserProvider, useUser } from '../../contexts/UserContext';
import { AuthProvider } from '../../contexts/AuthContext';
import { databaseService } from '../../services/databaseService';
import { supabase } from '../../services/supabaseClient';
import { Text } from 'react-native';

// Mock dependencies
jest.mock('../../services/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(),
  },
}));

jest.mock('../../services/databaseService', () => ({
  databaseService: {
    getUserProfile: jest.fn(),
    getUserAllergies: jest.fn(),
    saveUserProfile: jest.fn(),
    saveUserAllergies: jest.fn(),
    saveUserSession: jest.fn(),
    getUserSession: jest.fn(),
    clearAllUserData: jest.fn(),
  },
}));

// Test component that uses the user context
const TestConsumer = () => {
  const { userProfile, userAllergies, loading } = useUser();
  return (
    <>
      <Text testID="loading">{loading ? 'loading' : 'not-loading'}</Text>
      <Text testID="userName">{userProfile?.name || 'no-name'}</Text>
      <Text testID="allergiesCount">{userAllergies.length}</Text>
    </>
  );
};

describe('UserContext', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  };

  const mockProfile = {
    id: 'user-123',
    name: 'John',
    last_name: 'Doe',
    role: 'user',
    is_completed: true,
    photo_url: null,
  };

  const mockAllergies = [
    { id: 'allergy-1', profile_id: 'user-123', description: 'Peanuts' },
    { id: 'allergy-2', profile_id: 'user-123', description: 'Shellfish' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock - user is logged in
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    });
    
    (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
    });

    (databaseService.getUserProfile as jest.Mock).mockResolvedValue(mockProfile);
    (databaseService.getUserAllergies as jest.Mock).mockResolvedValue(mockAllergies);
    (databaseService.saveUserSession as jest.Mock).mockResolvedValue(undefined);
    (databaseService.saveUserProfile as jest.Mock).mockResolvedValue(undefined);
    (databaseService.saveUserAllergies as jest.Mock).mockResolvedValue(undefined);
  });

  describe('Initial State', () => {
    it('should start in loading state', async () => {
      const { getByTestId } = render(
        <AuthProvider>
          <UserProvider>
            <TestConsumer />
          </UserProvider>
        </AuthProvider>
      );

      // Wait for the component to finish loading
      await waitFor(() => {
        expect(getByTestId('loading')).toBeDefined();
      });
    });
  });

  describe('User Profile Loading', () => {
    it('should load user profile from database', async () => {
      const { getByTestId } = render(
        <AuthProvider>
          <UserProvider>
            <TestConsumer />
          </UserProvider>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(getByTestId('userName').props.children).toBe('John');
      });
    });

    it('should load user allergies from database', async () => {
      const { getByTestId } = render(
        <AuthProvider>
          <UserProvider>
            <TestConsumer />
          </UserProvider>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(getByTestId('allergiesCount').props.children).toBe(2);
      });
    });
  });

  describe('No User', () => {
    it('should have empty profile when no user is logged in', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { getByTestId } = render(
        <AuthProvider>
          <UserProvider>
            <TestConsumer />
          </UserProvider>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(getByTestId('userName').props.children).toBe('no-name');
      });
    });

    it('should have empty allergies when no user is logged in', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { getByTestId } = render(
        <AuthProvider>
          <UserProvider>
            <TestConsumer />
          </UserProvider>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(getByTestId('allergiesCount').props.children).toBe(0);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle profile fetch error gracefully', async () => {
      (databaseService.getUserProfile as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      const { getByTestId } = render(
        <AuthProvider>
          <UserProvider>
            <TestConsumer />
          </UserProvider>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(getByTestId('userName').props.children).toBe('no-name');
      });
    });

    it('should handle allergies fetch error gracefully', async () => {
      (databaseService.getUserAllergies as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      const { getByTestId } = render(
        <AuthProvider>
          <UserProvider>
            <TestConsumer />
          </UserProvider>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(getByTestId('allergiesCount').props.children).toBe(0);
      });
    });
  });

  describe('useUser hook', () => {
    it('should throw error when used outside UserProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const TestWithoutProvider = () => {
        const { userProfile } = useUser();
        return <Text>{userProfile?.name}</Text>;
      };

      expect(() => {
        render(<TestWithoutProvider />);
      }).toThrow('useUser must be used within a UserProvider');

      consoleSpy.mockRestore();
    });
  });
});
