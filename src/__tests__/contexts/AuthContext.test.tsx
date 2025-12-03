import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { databaseService } from '../../services/databaseService';
import { Text } from 'react-native';

// Mock dependencies
jest.mock('../../services/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(),
  },
}));

jest.mock('../../services/databaseService', () => ({
  databaseService: {
    saveUserProfile: jest.fn(),
    getUserProfile: jest.fn(),
    saveUserAllergies: jest.fn(),
    getUserAllergies: jest.fn(),
    saveUserSession: jest.fn(),
    getUserSession: jest.fn(),
    clearAllUserData: jest.fn(),
    clearUserSession: jest.fn(),
  },
}));

// Test component that uses the auth context
const TestConsumer = () => {
  const { user, loading, signIn, signOut } = useAuth();
  return (
    <>
      <Text testID="loading">{loading ? 'loading' : 'not-loading'}</Text>
      <Text testID="user">{user ? user.email : 'no-user'}</Text>
    </>
  );
};

describe('AuthContext', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    
    (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });
    
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    });
  });

  describe('Initial State', () => {
    it('should start with loading state', async () => {
      const { getByTestId } = render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      // Initially should be loading
      await waitFor(() => {
        expect(getByTestId('loading').props.children).toBe('not-loading');
      });
    });

    it('should have no user when no session exists', async () => {
      const { getByTestId } = render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(getByTestId('user').props.children).toBe('no-user');
      });
    });
  });

  describe('Session Restoration', () => {
    it('should restore user from existing session', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: {
          session: { user: mockUser },
        },
        error: null,
      });

      const { getByTestId } = render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(getByTestId('user').props.children).toBe('test@example.com');
      });
    });

    it('should restore from local storage when Supabase fails', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: new Error('Network error'),
      });

      (databaseService.getUserSession as jest.Mock).mockResolvedValue({
        userId: 'local-user-id',
        email: 'local@example.com',
      });

      const { getByTestId } = render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(getByTestId('user').props.children).toBe('local@example.com');
      });
    });
  });

  describe('Sign In', () => {
    it('should sign in successfully', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      let signInFn: (email: string, password: string) => Promise<void>;

      const TestWithSignIn = () => {
        const { signIn } = useAuth();
        signInFn = signIn;
        return <Text>Test</Text>;
      };

      render(
        <AuthProvider>
          <TestWithSignIn />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(signInFn).toBeDefined();
      });

      await act(async () => {
        await signInFn!('test@example.com', 'password123');
      });

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should throw error on sign in failure', async () => {
      const authError = new Error('Invalid credentials');
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: authError,
      });

      let signInFn: (email: string, password: string) => Promise<void>;

      const TestWithSignIn = () => {
        const { signIn } = useAuth();
        signInFn = signIn;
        return <Text>Test</Text>;
      };

      render(
        <AuthProvider>
          <TestWithSignIn />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(signInFn).toBeDefined();
      });

      await expect(
        act(async () => {
          await signInFn!('test@example.com', 'wrongpassword');
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('Sign Up', () => {
    it('should sign up successfully', async () => {
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      let signUpFn: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;

      const TestWithSignUp = () => {
        const { signUp } = useAuth();
        signUpFn = signUp;
        return <Text>Test</Text>;
      };

      render(
        <AuthProvider>
          <TestWithSignUp />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(signUpFn).toBeDefined();
      });

      await act(async () => {
        await signUpFn!('new@example.com', 'password123', 'John', 'Doe');
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: {
          data: {
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      });
    });
  });

  describe('Sign Out', () => {
    it('should sign out and clear local data', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: mockUser } },
        error: null,
      });

      (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });
      (databaseService.clearAllUserData as jest.Mock).mockResolvedValue(undefined);

      let signOutFn: () => Promise<void>;

      const TestWithSignOut = () => {
        const { signOut, user } = useAuth();
        signOutFn = signOut;
        return <Text testID="user">{user?.email || 'no-user'}</Text>;
      };

      const { getByTestId } = render(
        <AuthProvider>
          <TestWithSignOut />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(getByTestId('user').props.children).toBe('test@example.com');
      });

      await act(async () => {
        await signOutFn!();
      });

      expect(databaseService.clearAllUserData).toHaveBeenCalled();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestConsumer />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });
  });
});
