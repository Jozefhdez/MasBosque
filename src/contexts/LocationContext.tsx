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
        let isMounted = true;

        const initializePermission = async () => {
            try {
                setPermissionLoading(true);
                const granted = await locationService.checkPermission();
                
                if (!isMounted) return;
                
                // If permission is not granted, request it automatically
                if (!granted) {
                    const requestGranted = await locationService.requestPermissions();
                    
                    if (!isMounted) return;
                    
                    setHasPermission(requestGranted);
                } else {
                    setHasPermission(granted);
                }
            } catch (error) {
                if (!isMounted) return;
                
                logger.error('[Location Context] Error initializing permission:', error);
                setHasPermission(false);
            } finally {
                if (isMounted) {
                    setPermissionLoading(false);
                }
            }
        };
        
        initializePermission();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, []);

    const checkPermission = async () => {
        try {
            setPermissionLoading(true);
            const granted = await locationService.checkPermission();
            setHasPermission(granted);
        } catch (error) {
            logger.error('[Location Context] Error checking permission:', error);
            setHasPermission(false);
        } finally {
            setPermissionLoading(false);
        }
    };

    const requestPermission = async (): Promise<boolean> => {
        try {
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
            return;
        }

        try {
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
        locationService.stopTracking();
        setIsTracking(false);
        setCurrentLocation(null);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (isTracking) {
                logger.info('[Location Context] Cleaning up on unmount');
                locationService.stopTracking();
            }
        };
    }, [isTracking]);

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
