import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';
import locationService from '../services/locationService';
import { logger } from '../utils/logger';

interface LocationContextType {
    currentLocation: Location.LocationObject | null;
    hasPermission: boolean | null;
    isTracking: boolean;
    permissionLoading: boolean;
    startTracking: () => Promise<void>;
    stopTracking: () => void;
    requestPermission: () => Promise<boolean>;
    checkPermission: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [permissionLoading, setPermissionLoading] = useState(true);

    // Check permission status on mount and request if not granted
    useEffect(() => {
        const initializePermission = async () => {
            try {
                setPermissionLoading(true);
                const granted = await locationService.checkPermission();
                logger.log('[Location Context] Initial permission check:', granted ? 'granted' : 'not granted');
                
                // If permission is not granted, request it automatically
                if (!granted) {
                    logger.log('[Location Context] Permission not granted, requesting automatically');
                    const requestGranted = await locationService.requestPermissions();
                    setHasPermission(requestGranted);
                    logger.log('[Location Context] Permission request result:', requestGranted ? 'granted' : 'denied');
                } else {
                    setHasPermission(granted);
                }
            } catch (error) {
                logger.error('[Location Context] Error initializing permission:', error);
                setHasPermission(false);
            } finally {
                setPermissionLoading(false);
            }
        };
        
        initializePermission();
    }, []);

    const checkPermission = async () => {
        try {
            setPermissionLoading(true);
            const granted = await locationService.checkPermission();
            setHasPermission(granted);
            logger.log('[Location Context] Permission status:', granted ? 'granted' : 'not granted');
        } catch (error) {
            logger.error('[Location Context] Error checking permission:', error);
            setHasPermission(false);
        } finally {
            setPermissionLoading(false);
        }
    };

    const requestPermission = async (): Promise<boolean> => {
        try {
            logger.log('[Location Context] Requesting permission');
            const granted = await locationService.requestPermissions();
            setHasPermission(granted);
            return granted;
        } catch (error) {
            logger.error('[Location Context] Error requesting permission:', error);
            setHasPermission(false);
            return false;
        }
    };

    const startTracking = async () => {
        if (isTracking) {
            logger.log('[Location Context] Already tracking');
            return;
        }

        try {
            logger.log('[Location Context] Starting location tracking');
            await locationService.startTracking((location) => {
                setCurrentLocation(location);
            });
            setIsTracking(true);
        } catch (error) {
            logger.error('[Location Context] Failed to start tracking:', error);
            
            // Check if it's a permission error
            if (error instanceof Error && error.message.includes('permission')) {
                setHasPermission(false);
            }
            throw error;
        }
    };

    const stopTracking = () => {
        logger.log('[Location Context] Stopping location tracking');
        locationService.stopTracking();
        setIsTracking(false);
        setCurrentLocation(null);
    };

    const value: LocationContextType = {
        currentLocation,
        hasPermission,
        isTracking,
        permissionLoading,
        startTracking,
        stopTracking,
        requestPermission,
        checkPermission,
    };

    return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocation = (): LocationContextType => {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};
