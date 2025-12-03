import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useSignUpController } from '../../controllers/SignUpController';

// Mock dependencies
const mockNavigate = jest.fn();
const mockSignUp = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}));

jest.mock('../../contexts/AuthContext', () => ({
    useAuth: () => ({
        signUp: mockSignUp,
    }),
}));

jest.spyOn(Alert, 'alert');

describe('SignUpController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Initial State', () => {
        it('should initialize with empty fields', () => {
            const { result } = renderHook(() => useSignUpController());

            expect(result.current.name).toBe('');
            expect(result.current.lastName).toBe('');
            expect(result.current.email).toBe('');
            expect(result.current.password).toBe('');
            expect(result.current.showPassword).toBe(false);
            expect(result.current.readTOS).toBe(false);
        });
    });

    describe('handleGoSignIn', () => {
        it('should navigate to SignIn screen', async () => {
            const { result } = renderHook(() => useSignUpController());

            await act(async () => {
                await result.current.handleGoSignIn();
            });

            expect(mockNavigate).toHaveBeenCalledWith('SignIn');
        });
    });

    describe('handleSignUp Validation', () => {
        it('should show error when fields are empty', async () => {
            const { result } = renderHook(() => useSignUpController());

            await act(async () => {
                await result.current.handleSignUp();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Por favor completa todos los campos.'
            );
        });

        it('should show error for name with numbers', async () => {
            const { result } = renderHook(() => useSignUpController());

            act(() => {
                result.current.setName('John123');
                result.current.setLastName('Doe');
                result.current.setEmail('john@example.com');
                result.current.setPassword('Password1!');
                result.current.setReadTOS(true);
            });

            await act(async () => {
                await result.current.handleSignUp();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'El nombre solo puede contener letras.'
            );
        });

        it('should show error for lastName with special characters', async () => {
            const { result } = renderHook(() => useSignUpController());

            act(() => {
                result.current.setName('John');
                result.current.setLastName('Doe@#$');
                result.current.setEmail('john@example.com');
                result.current.setPassword('Password1!');
                result.current.setReadTOS(true);
            });

            await act(async () => {
                await result.current.handleSignUp();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'El apellido solo puede contener letras.'
            );
        });

        it('should show error for invalid email format', async () => {
            const { result } = renderHook(() => useSignUpController());

            act(() => {
                result.current.setName('John');
                result.current.setLastName('Doe');
                result.current.setEmail('invalid-email');
                result.current.setPassword('Password1!');
                result.current.setReadTOS(true);
            });

            await act(async () => {
                await result.current.handleSignUp();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Por favor ingresa un correo electrónico válido.'
            );
        });

        it('should show error for password less than 8 characters', async () => {
            const { result } = renderHook(() => useSignUpController());

            act(() => {
                result.current.setName('John');
                result.current.setLastName('Doe');
                result.current.setEmail('john@example.com');
                result.current.setPassword('Pass1!');
                result.current.setReadTOS(true);
            });

            await act(async () => {
                await result.current.handleSignUp();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'La nueva contraseña debe tener al menos 8 caracteres.'
            );
        });

        it('should show error for weak password (missing requirements)', async () => {
            const { result } = renderHook(() => useSignUpController());

            act(() => {
                result.current.setName('John');
                result.current.setLastName('Doe');
                result.current.setEmail('john@example.com');
                result.current.setPassword('password123');
                result.current.setReadTOS(true);
            });

            await act(async () => {
                await result.current.handleSignUp();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                expect.stringContaining('La contraseña debe contener')
            );
        });

        it('should show error when TOS not accepted', async () => {
            const { result } = renderHook(() => useSignUpController());

            act(() => {
                result.current.setName('John');
                result.current.setLastName('Doe');
                result.current.setEmail('john@example.com');
                result.current.setPassword('Password1!');
                result.current.setReadTOS(false);
            });

            await act(async () => {
                await result.current.handleSignUp();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Debes aceptar los términos y condiciones para continuar.'
            );
        });
    });

    describe('handleSignUp Success', () => {
        it('should call signUp and show success alert', async () => {
            mockSignUp.mockResolvedValueOnce(undefined);
            const { result } = renderHook(() => useSignUpController());

            act(() => {
                result.current.setName('John');
                result.current.setLastName('Doe');
                result.current.setEmail('john@example.com');
                result.current.setPassword('Password1!');
                result.current.setReadTOS(true);
            });

            await act(async () => {
                await result.current.handleSignUp();
            });

            expect(mockSignUp).toHaveBeenCalledWith(
                'john@example.com',
                'Password1!',
                'John',
                'Doe'
            );
            expect(Alert.alert).toHaveBeenCalledWith(
                'Cuenta creada',
                expect.any(String),
                expect.any(Array)
            );
        });
    });

    describe('handleSignUp Errors', () => {
        it('should show error for already registered email', async () => {
            mockSignUp.mockRejectedValueOnce(new Error('User already registered'));
            const { result } = renderHook(() => useSignUpController());

            act(() => {
                result.current.setName('John');
                result.current.setLastName('Doe');
                result.current.setEmail('existing@example.com');
                result.current.setPassword('Password1!');
                result.current.setReadTOS(true);
            });

            await act(async () => {
                await result.current.handleSignUp();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Este correo electrónico ya está registrado.'
            );
        });

        it('should show generic error for other failures', async () => {
            mockSignUp.mockRejectedValueOnce(new Error('Network error'));
            const { result } = renderHook(() => useSignUpController());

            act(() => {
                result.current.setName('John');
                result.current.setLastName('Doe');
                result.current.setEmail('john@example.com');
                result.current.setPassword('Password1!');
                result.current.setReadTOS(true);
            });

            await act(async () => {
                await result.current.handleSignUp();
            });

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'No se pudo crear la cuenta. Intenta de nuevo.'
            );
        });
    });

    describe('Name Validation Edge Cases', () => {
        it('should allow names with accented characters', async () => {
            mockSignUp.mockResolvedValueOnce(undefined);
            const { result } = renderHook(() => useSignUpController());

            act(() => {
                result.current.setName('José María');
                result.current.setLastName('González');
                result.current.setEmail('jose@example.com');
                result.current.setPassword('Password1!');
                result.current.setReadTOS(true);
            });

            await act(async () => {
                await result.current.handleSignUp();
            });

            expect(mockSignUp).toHaveBeenCalled();
        });
    });
});
