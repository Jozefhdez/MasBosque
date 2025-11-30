import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';
import { logger } from '../utils/logger';
import { databaseService } from '../services/databaseService';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  dataReady: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch user data from Supabase and save to local database
  const fetchAndSaveUserData = async (userId: string) => {
    // Prevent duplicate fetches
    if (isFetching) {
      logger.log('[AuthContext] Fetch already in progress, skipping...');
      return;
    }

    setIsFetching(true);
    try {
      // Fetch user profile from Supabase
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        logger.error('[AuthContext] Error fetching user profile from Supabase:', profileError);
        return;
      }

      if (profileData) {
        // Save to local database
        await databaseService.saveUserProfile(profileData);
        logger.log('[AuthContext] User profile saved to local database');
      }

      // Fetch user allergies from Supabase
      const { data: allergiesData, error: allergiesError } = await supabase
        .from('allergies')
        .select('*')
        .eq('profile_id', userId);

      if (allergiesError) {
        logger.error('[AuthContext] Error fetching user allergies from Supabase:', allergiesError);
        return;
      }

      if (allergiesData) {
        // Save to local database
        await databaseService.saveUserAllergies(userId, allergiesData);
        logger.log('[AuthContext] User allergies saved to local database');
      }
      
      // Mark data as ready after successful save
      setDataReady(true);
    } catch (error) {
      logger.error('[AuthContext] Error fetching and saving user data:', error);
      setDataReady(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    let isInitialLoad = true;
    
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Fetch and save user data when session is restored
        fetchAndSaveUserData(session.user.id);
      }
      setLoading(false);
      isInitialLoad = false;
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      // Only fetch on SIGNED_IN event and not during initial load
      // (to avoid duplicate fetch with getSession above)
      if (session?.user && event === 'SIGNED_IN' && !isInitialLoad) {
        fetchAndSaveUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data.user);
    
    // Fetch and save user data to local database
    if (data.user) {
      await fetchAndSaveUserData(data.user.id);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          firstName: firstName,
          lastName: lastName,
        }
      }
    });
    if (error) throw error;
    
    logger.log('[Auth Context] User signed up successfully. Profile will be created via database trigger.');
    
    // Fetch and save user data to local database if user exists
    if (data.user) {
      // Wait a bit for the database trigger to create the profile
      setTimeout(async () => {
        await fetchAndSaveUserData(data.user!.id);
      }, 1000);
    }
  };

  const signOut = async () => {
    if (user) {
      // Clear local user data
      await databaseService.clearAllUserData();
      logger.log('[AuthContext] Local user data cleared');
    }
    
    await supabase.auth.signOut();
    setUser(null);
    setDataReady(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, dataReady, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};