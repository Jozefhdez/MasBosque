import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSOSController } from '../../controllers/SOSController';

// Mock dependencies
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}));

jest.mock('expo-crypto', () => ({
    randomUUID: () => 'mock-uuid-12345',
}));

const mockUserProfile = {
    id: 'user-123',
    name: 'John',
    last_name: 'Doe',
    photo_url: 'https://example.com/photo.jpg',
    is_completed: true,
};

jest.mock('../../contexts/UserContext', () => ({
    useUser: () => ({
        userProfile: mockUserProfile,
        loading: false,
    }),
}));

const mockStartTracking = jest.fn();
const mockStopTracking = jest.fn();

jest.mock('../../contexts/LocationContext', () => ({
    useLocation: () => ({
        currentLocation: {
            coords: { latitude: 20.6736, longitude: -103.3440 },
            timestamp: Date.now(),
        },
        startTracking: mockStartTracking,
        stopTracking: mockStopTracking,
        isTracking: false,
    }),
}));

const mockStartScan = jest.fn();
const mockStopScan = jest.fn();
const mockConnect = jest.fn();
const mockSendLocationData = jest.fn();
const mockDisconnect = jest.fn();

jest.mock('../../contexts/BluetoothContext', () => ({
    useBluetooth: () => ({
        startScan: mockStartScan,
        stopScan: mockStopScan,
        connect: mockConnect,
        sendLocationData: mockSendLocationData,
        disconnect: mockDisconnect,
    }),
}));

describe('SOSController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockStartScan.mockResolvedValue(undefined);
        mockStartTracking.mockResolvedValue(undefined);
        mockConnect.mockResolvedValue({ id: 'device-1', name: 'LoRa Node' });
    });

    describe('Initial State', () => {
        it('should initialize with correct default values', async () => {
            const { result } = renderHook(() => useSOSController());

            await waitFor(() => {
                expect(result.current.isConnected).toBe(false);
                expect(result.current.isSOSActive).toBe(false);
                expect(result.current.userName).toBe('John Doe');
                expect(result.current.userPhoto).toBe('https://example.com/photo.jpg');
            });
        });
    });

    describe('handleGoProfile', () => {
        it('should navigate to Profile screen', async () => {
            const { result } = renderHook(() => useSOSController());

            await act(async () => {
                await result.current.handleGoProfile();
            });

            expect(mockNavigate).toHaveBeenCalledWith('Profile');
        });
    });

    describe('handleSOSPress', () => {
        it('should activate SOS and start scanning', async () => {
            const { result } = renderHook(() => useSOSController());

            await act(async () => {
                await result.current.handleSOSPress();
            });

            await waitFor(() => {
                expect(result.current.isSOSActive).toBe(true);
            });
            expect(mockStartScan).toHaveBeenCalled();
            expect(mockStartTracking).toHaveBeenCalled();
        });

        it('should handle bluetooth scan failure', async () => {
            mockStartScan.mockRejectedValueOnce(new Error('Bluetooth not available'));
            const { result } = renderHook(() => useSOSController());

            await act(async () => {
                await result.current.handleSOSPress();
            });

            await waitFor(() => {
                expect(result.current.isSOSActive).toBe(false);
            });
        });

        it('should handle location tracking failure', async () => {
            mockStartTracking.mockRejectedValueOnce(new Error('Location not available'));
            const { result } = renderHook(() => useSOSController());

            await act(async () => {
                await result.current.handleSOSPress();
            });

            await waitFor(() => {
                expect(result.current.isSOSActive).toBe(false);
            });
        });
    });

    describe('handleSOSCancel', () => {
        it('should deactivate SOS and stop all services', async () => {
            const { result } = renderHook(() => useSOSController());

            // First activate SOS
            await act(async () => {
                await result.current.handleSOSPress();
            });

            // Then cancel it
            await act(async () => {
                await result.current.handleSOSCancel();
            });

            await waitFor(() => {
                expect(result.current.isSOSActive).toBe(false);
                expect(result.current.isConnected).toBe(false);
            });
            expect(mockStopTracking).toHaveBeenCalled();
            expect(mockStopScan).toHaveBeenCalled();
        });
    });

    describe('Location Data', () => {
        it('should expose current location', async () => {
            const { result } = renderHook(() => useSOSController());

            await waitFor(() => {
                expect(result.current.currentLocation).toBeDefined();
                expect(result.current.currentLocation?.coords.latitude).toBe(20.6736);
                expect(result.current.currentLocation?.coords.longitude).toBe(-103.3440);
            });
        });
    });
});
