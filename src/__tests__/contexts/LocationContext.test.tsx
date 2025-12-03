import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { LocationProvider, useLocation } from '../../contexts/LocationContext';
import locationService from '../../services/locationService';

// Mock the location service
jest.mock('../../services/locationService', () => ({
    checkPermission: jest.fn(),
    requestPermissions: jest.fn(),
    startTracking: jest.fn(),
    stopTracking: jest.fn(),
}));

const mockedLocationService = locationService as jest.Mocked<typeof locationService>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <LocationProvider>{children}</LocationProvider>
);

describe('LocationContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedLocationService.checkPermission.mockResolvedValue(true);
        mockedLocationService.requestPermissions.mockResolvedValue(true);
    });

    describe('useLocation hook', () => {
        it('should throw error when used outside provider', () => {
            // Suppress console.error for this test
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            
            expect(() => {
                renderHook(() => useLocation());
            }).toThrow('useLocation must be used within a LocationProvider');
            
            consoleSpy.mockRestore();
        });
    });

    describe('Initial State and Permission Check', () => {
        it('should check permission on mount', async () => {
            renderHook(() => useLocation(), { wrapper });

            await waitFor(() => {
                expect(mockedLocationService.checkPermission).toHaveBeenCalled();
            });
        });

        it('should set hasPermission to true when granted', async () => {
            mockedLocationService.checkPermission.mockResolvedValue(true);
            
            const { result } = renderHook(() => useLocation(), { wrapper });

            await waitFor(() => {
                expect(result.current.hasPermission).toBe(true);
                expect(result.current.permissionLoading).toBe(false);
            });
        });

        it('should request permission if not initially granted', async () => {
            mockedLocationService.checkPermission.mockResolvedValue(false);
            mockedLocationService.requestPermissions.mockResolvedValue(true);
            
            const { result } = renderHook(() => useLocation(), { wrapper });

            await waitFor(() => {
                expect(mockedLocationService.requestPermissions).toHaveBeenCalled();
                expect(result.current.hasPermission).toBe(true);
            });
        });

        it('should set hasPermission to false on error', async () => {
            mockedLocationService.checkPermission.mockRejectedValue(new Error('Failed'));
            
            const { result } = renderHook(() => useLocation(), { wrapper });

            await waitFor(() => {
                expect(result.current.hasPermission).toBe(false);
            });
        });

        it('should initialize with null currentLocation', async () => {
            const { result } = renderHook(() => useLocation(), { wrapper });

            await waitFor(() => {
                expect(result.current.currentLocation).toBeNull();
                expect(result.current.isTracking).toBe(false);
            });
        });
    });

    describe('Tracking', () => {
        it('should start tracking and update isTracking state', async () => {
            mockedLocationService.startTracking.mockResolvedValue(undefined);
            
            const { result } = renderHook(() => useLocation(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            await act(async () => {
                await result.current.startTracking();
            });

            expect(mockedLocationService.startTracking).toHaveBeenCalled();
            expect(result.current.isTracking).toBe(true);
        });

        it('should not start tracking if already tracking', async () => {
            mockedLocationService.startTracking.mockResolvedValue(undefined);
            
            const { result } = renderHook(() => useLocation(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            // Start first tracking
            await act(async () => {
                await result.current.startTracking();
            });

            // Try to start second tracking
            await act(async () => {
                await result.current.startTracking();
            });

            // startTracking should only be called once
            expect(mockedLocationService.startTracking).toHaveBeenCalledTimes(1);
        });

        it('should update currentLocation when callback is called', async () => {
            const mockLocation = {
                coords: {
                    latitude: 20.6736,
                    longitude: -103.3440,
                    altitude: null,
                    accuracy: 10,
                    heading: null,
                    speed: null,
                    altitudeAccuracy: null,
                },
                timestamp: Date.now(),
            };

            mockedLocationService.startTracking.mockImplementation(async (callback) => {
                // Simulate location update
                callback(mockLocation);
            });
            
            const { result } = renderHook(() => useLocation(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            await act(async () => {
                await result.current.startTracking();
            });

            expect(result.current.currentLocation).toEqual(mockLocation);
        });

        it('should stop tracking and reset state', async () => {
            mockedLocationService.startTracking.mockResolvedValue(undefined);
            
            const { result } = renderHook(() => useLocation(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            await act(async () => {
                await result.current.startTracking();
            });

            act(() => {
                result.current.stopTracking();
            });

            expect(mockedLocationService.stopTracking).toHaveBeenCalled();
            expect(result.current.isTracking).toBe(false);
            expect(result.current.currentLocation).toBeNull();
        });

        it('should handle tracking error', async () => {
            const trackingError = new Error('Location tracking failed');
            mockedLocationService.startTracking.mockRejectedValue(trackingError);
            
            const { result } = renderHook(() => useLocation(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            await expect(act(async () => {
                await result.current.startTracking();
            })).rejects.toThrow('Location tracking failed');
        });
    });

    describe('Request Permission', () => {
        it('should request permission and update state', async () => {
            mockedLocationService.requestPermissions.mockResolvedValue(true);
            
            const { result } = renderHook(() => useLocation(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            let granted;
            await act(async () => {
                granted = await result.current.requestPermission();
            });

            expect(granted).toBe(true);
            expect(result.current.hasPermission).toBe(true);
        });

        it('should handle permission request denial', async () => {
            mockedLocationService.requestPermissions.mockResolvedValue(false);
            
            const { result } = renderHook(() => useLocation(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            let granted;
            await act(async () => {
                granted = await result.current.requestPermission();
            });

            expect(granted).toBe(false);
            expect(result.current.hasPermission).toBe(false);
        });

        it('should handle permission request failure', async () => {
            mockedLocationService.requestPermissions.mockRejectedValue(new Error('Failed'));
            
            const { result } = renderHook(() => useLocation(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            let granted;
            await act(async () => {
                granted = await result.current.requestPermission();
            });

            expect(granted).toBe(false);
            expect(result.current.hasPermission).toBe(false);
        });
    });

    describe('Check Permission', () => {
        it('should check permission and update state', async () => {
            const { result } = renderHook(() => useLocation(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            mockedLocationService.checkPermission.mockResolvedValue(false);

            await act(async () => {
                await result.current.checkPermission();
            });

            expect(result.current.hasPermission).toBe(false);
        });

        it('should handle check permission error', async () => {
            const { result } = renderHook(() => useLocation(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            mockedLocationService.checkPermission.mockRejectedValue(new Error('Check failed'));

            await act(async () => {
                await result.current.checkPermission();
            });

            expect(result.current.hasPermission).toBe(false);
        });
    });

    describe('Context Value', () => {
        it('should provide all expected values and methods', async () => {
            const { result } = renderHook(() => useLocation(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            expect(result.current).toHaveProperty('currentLocation');
            expect(result.current).toHaveProperty('hasPermission');
            expect(result.current).toHaveProperty('isTracking');
            expect(result.current).toHaveProperty('permissionLoading');
            expect(result.current).toHaveProperty('startTracking');
            expect(result.current).toHaveProperty('stopTracking');
            expect(result.current).toHaveProperty('requestPermission');
            expect(result.current).toHaveProperty('checkPermission');
            
            expect(typeof result.current.startTracking).toBe('function');
            expect(typeof result.current.stopTracking).toBe('function');
            expect(typeof result.current.requestPermission).toBe('function');
            expect(typeof result.current.checkPermission).toBe('function');
        });
    });
});
