import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';
import { UserProfile } from '../models/userProfileModel';
import { UserAllergies } from '../models/userAllergiesModel';

type UserContextType = {
  userProfile: UserProfile | null;
  userAllergies: UserAllergies[];
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
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
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    } else {
      setUserProfile(data);
    }
    setLoading(false);
  };

  const fetchUserAllergies = async () => {
    if (!user) {
      setUserAllergies([]);
      return;
    }

    const { data, error } = await supabase
      .from('allergies')
      .select('*')
      .eq('profile_id', user.id)

    if (error) {
      console.error('Error fetching user allergies:', error);
      setUserAllergies([]);
    } else {
      setUserAllergies(data || []);
    }
  }

  const refreshUser = async () => {
    await Promise.all([fetchUserProfile(), fetchUserAllergies()]);
  };

  useEffect(() => {
    refreshUser();
  }, [user]);

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