import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { BluetoothProvider, useBluetooth } from '../../contexts/BluetoothContext';
import bluetoothService from '../../services/bluetoothService';

// Mock the bluetooth service
jest.mock('../../services/bluetoothService', () => ({
    checkPermission: jest.fn(),
    requestPermissions: jest.fn(),
    startScan: jest.fn(),
    stopScan: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    sendLocationData: jest.fn(),
    getServicesAndCharacteristics: jest.fn(),
}));

const mockedBluetoothService = bluetoothService as jest.Mocked<typeof bluetoothService>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BluetoothProvider>{children}</BluetoothProvider>
);

describe('BluetoothContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedBluetoothService.checkPermission.mockResolvedValue(true);
        mockedBluetoothService.requestPermissions.mockResolvedValue(true);
    });

    describe('useBluetooth hook', () => {
        it('should throw error when used outside provider', () => {
            // Suppress console.error for this test
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            
            expect(() => {
                renderHook(() => useBluetooth());
            }).toThrow('useBluetooth must be used within a BluetoothProvider');
            
            consoleSpy.mockRestore();
        });
    });

    describe('Initial State and Permission Check', () => {
        it('should check permission on mount', async () => {
            renderHook(() => useBluetooth(), { wrapper });

            await waitFor(() => {
                expect(mockedBluetoothService.checkPermission).toHaveBeenCalled();
            });
        });

        it('should set hasPermission to true when granted', async () => {
            mockedBluetoothService.checkPermission.mockResolvedValue(true);
            
            const { result } = renderHook(() => useBluetooth(), { wrapper });

            await waitFor(() => {
                expect(result.current.hasPermission).toBe(true);
                expect(result.current.permissionLoading).toBe(false);
            });
        });

        it('should request permission if not initially granted', async () => {
            mockedBluetoothService.checkPermission.mockResolvedValue(false);
            mockedBluetoothService.requestPermissions.mockResolvedValue(true);
            
            const { result } = renderHook(() => useBluetooth(), { wrapper });

            await waitFor(() => {
                expect(mockedBluetoothService.requestPermissions).toHaveBeenCalled();
                expect(result.current.hasPermission).toBe(true);
            });
        });

        it('should set hasPermission to false on error', async () => {
            mockedBluetoothService.checkPermission.mockRejectedValue(new Error('Failed'));
            
            const { result } = renderHook(() => useBluetooth(), { wrapper });

            await waitFor(() => {
                expect(result.current.hasPermission).toBe(false);
            });
        });
    });

    describe('Scanning', () => {
        it('should start scan and update isScanning state', async () => {
            mockedBluetoothService.startScan.mockResolvedValue(undefined);
            
            const { result } = renderHook(() => useBluetooth(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            const onDeviceFound = jest.fn();
            
            await act(async () => {
                await result.current.startScan(onDeviceFound);
            });

            expect(mockedBluetoothService.startScan).toHaveBeenCalledWith(onDeviceFound);
            expect(result.current.isScanning).toBe(true);
        });

        it('should not start scan if already scanning', async () => {
            mockedBluetoothService.startScan.mockResolvedValue(undefined);
            
            const { result } = renderHook(() => useBluetooth(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            // Start first scan
            await act(async () => {
                await result.current.startScan(jest.fn());
            });

            // Try to start second scan
            await act(async () => {
                await result.current.startScan(jest.fn());
            });

            // startScan should only be called once
            expect(mockedBluetoothService.startScan).toHaveBeenCalledTimes(1);
        });

        it('should stop scan and update isScanning state', async () => {
            mockedBluetoothService.startScan.mockResolvedValue(undefined);
            
            const { result } = renderHook(() => useBluetooth(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            await act(async () => {
                await result.current.startScan(jest.fn());
            });

            act(() => {
                result.current.stopScan();
            });

            expect(mockedBluetoothService.stopScan).toHaveBeenCalled();
            expect(result.current.isScanning).toBe(false);
        });

        it('should handle scan error', async () => {
            const scanError = new Error('Bluetooth scan failed');
            mockedBluetoothService.startScan.mockRejectedValue(scanError);
            
            const { result } = renderHook(() => useBluetooth(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            await expect(act(async () => {
                await result.current.startScan(jest.fn());
            })).rejects.toThrow('Bluetooth scan failed');
        });
    });

    describe('Connection', () => {
        it('should connect to a device', async () => {
            const mockDevice = { id: 'device-1', name: 'Test Device', onDisconnected: jest.fn() };
            mockedBluetoothService.connect.mockResolvedValue(mockDevice as any);
            
            const { result } = renderHook(() => useBluetooth(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            let connectedDevice;
            await act(async () => {
                connectedDevice = await result.current.connect('device-1');
            });

            expect(mockedBluetoothService.connect).toHaveBeenCalledWith('device-1');
            expect(result.current.connectedDevice).toEqual(mockDevice);
        });

        it('should handle connection failure', async () => {
            mockedBluetoothService.connect.mockRejectedValue(new Error('Connection failed'));
            
            const { result } = renderHook(() => useBluetooth(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            let connectedDevice;
            await act(async () => {
                connectedDevice = await result.current.connect('device-1');
            });

            expect(connectedDevice).toBeNull();
        });

        it('should disconnect from a device', async () => {
            const mockDevice = { id: 'device-1', name: 'Test Device', onDisconnected: jest.fn() };
            mockedBluetoothService.connect.mockResolvedValue(mockDevice as any);
            mockedBluetoothService.disconnect.mockResolvedValue(undefined);
            
            const { result } = renderHook(() => useBluetooth(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            // Connect first
            await act(async () => {
                await result.current.connect('device-1');
            });

            // Then disconnect
            await act(async () => {
                await result.current.disconnect();
            });

            expect(mockedBluetoothService.disconnect).toHaveBeenCalledWith('device-1');
            expect(result.current.connectedDevice).toBeNull();
        });

        it('should disconnect specific device by id', async () => {
            mockedBluetoothService.disconnect.mockResolvedValue(undefined);
            
            const { result } = renderHook(() => useBluetooth(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            await act(async () => {
                await result.current.disconnect('specific-device-id');
            });

            expect(mockedBluetoothService.disconnect).toHaveBeenCalledWith('specific-device-id');
        });
    });

    describe('Send Location Data', () => {
        it('should return false when no device is connected', async () => {
            const { result } = renderHook(() => useBluetooth(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            let sendResult;
            await act(async () => {
                sendResult = await result.current.sendLocationData(
                    'service-uuid',
                    'char-uuid',
                    'alert-uuid',
                    'user-id',
                    20.6736,
                    -103.3440
                );
            });

            expect(sendResult).toBe(false);
        });

        it('should send location data when connected', async () => {
            const mockDevice = { id: 'device-1', name: 'Test Device', onDisconnected: jest.fn() };
            mockedBluetoothService.connect.mockResolvedValue(mockDevice as any);
            mockedBluetoothService.sendLocationData.mockResolvedValue(true);
            
            const { result } = renderHook(() => useBluetooth(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            // Connect first
            await act(async () => {
                await result.current.connect('device-1');
            });

            let sendResult;
            await act(async () => {
                sendResult = await result.current.sendLocationData(
                    'service-uuid',
                    'char-uuid',
                    'alert-uuid',
                    'user-id',
                    20.6736,
                    -103.3440
                );
            });

            expect(mockedBluetoothService.sendLocationData).toHaveBeenCalledWith(
                mockDevice,
                'service-uuid',
                'char-uuid',
                'alert-uuid',
                'user-id',
                20.6736,
                -103.3440
            );
            expect(sendResult).toBe(true);
        });
    });

    describe('Request Permission', () => {
        it('should request permission and update state', async () => {
            mockedBluetoothService.requestPermissions.mockResolvedValue(true);
            
            const { result } = renderHook(() => useBluetooth(), { wrapper });

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

        it('should handle permission request failure', async () => {
            mockedBluetoothService.requestPermissions.mockRejectedValue(new Error('Failed'));
            
            const { result } = renderHook(() => useBluetooth(), { wrapper });

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
            const { result } = renderHook(() => useBluetooth(), { wrapper });

            await waitFor(() => {
                expect(result.current.permissionLoading).toBe(false);
            });

            mockedBluetoothService.checkPermission.mockResolvedValue(false);

            await act(async () => {
                await result.current.checkPermission();
            });

            expect(result.current.hasPermission).toBe(false);
        });
    });
});
