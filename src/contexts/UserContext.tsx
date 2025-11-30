import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { UserProfile } from '../models/userProfileModel';
import { UserAllergies } from '../models/userAllergiesModel';
import { databaseService } from '../services/databaseService';
import { logger } from '../utils/logger';

type UserContextType = {
  userProfile: UserProfile | null;
  userAllergies: UserAllergies[];
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, dataReady } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userAllergies, setUserAllergies] = useState<UserAllergies[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    if (!user) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const profile = await databaseService.getUserProfile(user.id);
      
      // If profile is null, it might not be written yet - wait and retry
      if (!profile) {
        logger.log('[UserContext] Profile not found in database, retrying...');
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms
        const retryProfile = await databaseService.getUserProfile(user.id);
        setUserProfile(retryProfile);
        logger.log('[UserContext] User profile loaded from local database (retry):', retryProfile ? 'found' : 'not found');
      } else {
        setUserProfile(profile);
        logger.log('[UserContext] User profile loaded from local database');
      }
    } catch (error) {
      logger.error('[UserContext] Error fetching user profile from database:', error);
      setUserProfile(null);
    }
    setLoading(false);
  };

  const fetchUserAllergies = async () => {
    if (!user) {
      setUserAllergies([]);
      return;
    }

    try {
      const allergies = await databaseService.getUserAllergies(user.id);
      setUserAllergies(allergies);
      logger.log('[UserContext] User allergies loaded from local database');
    } catch (error) {
      logger.error('[UserContext] Error fetching user allergies from database:', error);
      setUserAllergies([]);
    }
  }

  const refreshUser = async () => {
    await Promise.all([fetchUserProfile(), fetchUserAllergies()]);
  };

  useEffect(() => {
    // Only fetch when user exists and data is ready
    if (user && dataReady) {
      refreshUser();
    } else if (!user) {
      // Clear state when user is logged out
      setUserProfile(null);
      setUserAllergies([]);
      setLoading(false);
    } else if (user && !dataReady) {
      // User exists but data is not ready yet - keep loading
      setLoading(true);
    }
  }, [user, dataReady]);

  return (
    <UserContext.Provider value={{ userProfile, userAllergies, loading, refreshUser: refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};