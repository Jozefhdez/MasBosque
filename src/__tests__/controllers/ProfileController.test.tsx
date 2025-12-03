import { renderHook, act, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useProfileController } from '../../controllers/ProfileController';

// Mock dependencies
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockSignOut = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: mockGoBack,
    }),
}));

jest.mock('../../contexts/AuthContext', () => ({
    useAuth: () => ({
        signOut: mockSignOut,
    }),
}));

const mockUserProfile = {
    id: 'user-123',
    name: 'John',
    last_name: 'Doe',
    photo_url: 'https://example.com/photo.jpg',
    is_completed: true,
};

const mockUserAllergies = [
    { id: 'allergy-1', profile_id: 'user-123', description: 'Peanuts' },
    { id: 'allergy-2', profile_id: 'user-123', description: 'Shellfish' },
];

let mockUserContextValue = {
    userProfile: mockUserProfile,
    userAllergies: mockUserAllergies,
    loading: false,
};

jest.mock('../../contexts/UserContext', () => ({
    useUser: () => mockUserContextValue,
}));

jest.spyOn(Alert, 'alert');

describe('ProfileController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUserContextValue = {
            userProfile: mockUserProfile,
            userAllergies: mockUserAllergies,
            loading: false,
        };
    });

    describe('Initial State', () => {
        it('should initialize with user data from context', async () => {
            const { result } = renderHook(() => useProfileController());

            await waitFor(() => {
                expect(result.current.userName).toBe('John Doe');
                expect(result.current.userPhoto).toBe('https://example.com/photo.jpg');
                expect(result.current.allergies).toEqual(mockUserAllergies);
            });
        });

        it('should handle null user profile', async () => {
            mockUserContextValue = {
                userProfile: null as any,
                userAllergies: [],
                loading: false,
            };

            const { result } = renderHook(() => useProfileController());

            await waitFor(() => {
                expect(result.current.userName).toBe('');
                expect(result.current.userPhoto).toBeNull();
            });
        });
    });

    describe('handleGoBack', () => {
        it('should call goBack navigation', async () => {
            const { result } = renderHook(() => useProfileController());

            await act(async () => {
                await result.current.handleGoBack();
            });

            expect(mockGoBack).toHaveBeenCalled();
        });
    });

    describe('handleGoModifyProfile', () => {
        it('should navigate to ModifyProfile screen', async () => {
            const { result } = renderHook(() => useProfileController());

            await act(async () => {
                await result.current.handleGoModifyProfile();
            });

            expect(mockNavigate).toHaveBeenCalledWith('ModifyProfile');
        });
    });

    describe('handleSignOut', () => {
        it('should show confirmation alert', async () => {
            const { result } = renderHook(() => useProfileController());

            await act(async () => {
                await result.current.handleSignOut();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Cerrar sesión',
                '¿Estás seguro que deseas cerrar sesión?',
                expect.arrayContaining([
                    expect.objectContaining({ text: 'Cancelar', style: 'cancel' }),
                    expect.objectContaining({ text: 'Cerrar sesión', style: 'destructive' }),
                ])
            );
        });

        it('should call signOut when confirmed', async () => {
            const { result } = renderHook(() => useProfileController());

            await act(async () => {
                await result.current.handleSignOut();
            });

            // Get the alert buttons and simulate pressing confirm
            const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
            const buttons = alertCall[2];
            const confirmButton = buttons.find((b: any) => b.text === 'Cerrar sesión');

            await act(async () => {
                await confirmButton.onPress();
            });

            expect(mockSignOut).toHaveBeenCalled();
        });
    });

    describe('handleDeleteAccount', () => {
        it('should show confirmation alert with warning', async () => {
            const { result } = renderHook(() => useProfileController());

            await act(async () => {
                await result.current.handleDeleteAccount();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Eliminar cuenta',
                '¿Estás seguro? Esta acción no se puede deshacer.',
                expect.any(Array)
            );
        });

        it('should sign out after account deletion confirmation', async () => {
            const { result } = renderHook(() => useProfileController());

            await act(async () => {
                await result.current.handleDeleteAccount();
            });

            // Simulate pressing delete confirmation
            const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
            const buttons = alertCall[2];
            const deleteButton = buttons.find((b: any) => b.text === 'Eliminar');

            await act(async () => {
                await deleteButton.onPress();
            });

            // Should show success alert and sign out
            expect(mockSignOut).toHaveBeenCalled();
        });
    });

    describe('User Data Loading', () => {
        it('should update state when userProfile changes', async () => {
            const { result, rerender } = renderHook(() => useProfileController());

            // Initial state
            await waitFor(() => {
                expect(result.current.userName).toBe('John Doe');
            });

            // Update mock context
            mockUserContextValue = {
                userProfile: { ...mockUserProfile, name: 'Jane', last_name: 'Smith' },
                userAllergies: [],
                loading: false,
            };

            // Rerender to pick up new context
            rerender({});

            await waitFor(() => {
                expect(result.current.userName).toBe('Jane Smith');
            });
        });
    });
});
