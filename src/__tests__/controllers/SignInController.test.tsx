import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useSignInController } from '../../controllers/SignInController';

// Mock dependencies
const mockNavigate = jest.fn();
const mockSignIn = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}));

jest.mock('../../contexts/AuthContext', () => ({
    useAuth: () => ({
        signIn: mockSignIn,
    }),
}));

jest.spyOn(Alert, 'alert');

describe('SignInController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Initial State', () => {
        it('should initialize with empty email and password', () => {
            const { result } = renderHook(() => useSignInController());

            expect(result.current.email).toBe('');
            expect(result.current.password).toBe('');
            expect(result.current.showPassword).toBe(false);
        });
    });

    describe('handleGoSignUp', () => {
        it('should navigate to SignUp screen', async () => {
            const { result } = renderHook(() => useSignInController());

            await act(async () => {
                await result.current.handleGoSignUp();
            });

            expect(mockNavigate).toHaveBeenCalledWith('SignUp');
        });
    });

    describe('handleSignIn', () => {
        it('should show error alert when email is empty', async () => {
            const { result } = renderHook(() => useSignInController());

            act(() => {
                result.current.setPassword('password123');
            });

            await act(async () => {
                await result.current.handleSignIn();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Por favor completa todos los campos.'
            );
            expect(mockSignIn).not.toHaveBeenCalled();
        });

        it('should show error alert when password is empty', async () => {
            const { result } = renderHook(() => useSignInController());

            act(() => {
                result.current.setEmail('test@example.com');
            });

            await act(async () => {
                await result.current.handleSignIn();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Por favor completa todos los campos.'
            );
        });

        it('should show error alert for invalid email format', async () => {
            const { result } = renderHook(() => useSignInController());

            act(() => {
                result.current.setEmail('invalid-email');
                result.current.setPassword('password123');
            });

            await act(async () => {
                await result.current.handleSignIn();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Por favor ingresa un correo electrónico válido.'
            );
        });

        it('should call signIn with valid credentials', async () => {
            mockSignIn.mockResolvedValueOnce(undefined);
            const { result } = renderHook(() => useSignInController());

            act(() => {
                result.current.setEmail('test@example.com');
                result.current.setPassword('password123');
            });

            await act(async () => {
                await result.current.handleSignIn();
            });

            expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
        });

        it('should show error for unconfirmed email', async () => {
            mockSignIn.mockRejectedValueOnce(new Error('Email not confirmed'));
            const { result } = renderHook(() => useSignInController());

            act(() => {
                result.current.setEmail('test@example.com');
                result.current.setPassword('password123');
            });

            await act(async () => {
                await result.current.handleSignIn();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Por favor confirma tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.'
            );
        });

        it('should show error for invalid credentials', async () => {
            mockSignIn.mockRejectedValueOnce(new Error('Invalid login credentials'));
            const { result } = renderHook(() => useSignInController());

            act(() => {
                result.current.setEmail('test@example.com');
                result.current.setPassword('wrongpassword');
            });

            await act(async () => {
                await result.current.handleSignIn();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Correo o contraseña incorrectos.'
            );
        });
    });

    describe('handleForgotPassword', () => {
        it('should show error when email is empty', async () => {
            const { result } = renderHook(() => useSignInController());

            await act(async () => {
                await result.current.handleForgotPassword();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Por favor ingresa tu correo electrónico para recuperar tu contraseña.'
            );
        });

        it('should show error for invalid email format', async () => {
            const { result } = renderHook(() => useSignInController());

            act(() => {
                result.current.setEmail('invalid');
            });

            await act(async () => {
                await result.current.handleForgotPassword();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Por favor ingresa un correo electrónico válido.'
            );
        });

        it('should show confirmation dialog with valid email', async () => {
            const { result } = renderHook(() => useSignInController());

            act(() => {
                result.current.setEmail('test@example.com');
            });

            await act(async () => {
                await result.current.handleForgotPassword();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Recuperar contraseña',
                'Se enviará un correo para restablecer tu contraseña.',
                expect.any(Array)
            );
        });
    });

    describe('State Setters', () => {
        it('should update email state', () => {
            const { result } = renderHook(() => useSignInController());

            act(() => {
                result.current.setEmail('new@email.com');
            });

            expect(result.current.email).toBe('new@email.com');
        });

        it('should update password state', () => {
            const { result } = renderHook(() => useSignInController());

            act(() => {
                result.current.setPassword('newpassword');
            });

            expect(result.current.password).toBe('newpassword');
        });

        it('should toggle showPassword state', () => {
            const { result } = renderHook(() => useSignInController());

            act(() => {
                result.current.setShowPassword(true);
            });

            expect(result.current.showPassword).toBe(true);
        });
    });
});
