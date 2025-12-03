import { renderHook } from '@testing-library/react-native';
import { LandingController } from '../../controllers/LandingController';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}));

describe('LandingController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('handleGoSignIn', () => {
        it('should navigate to SignIn screen', async () => {
            const { result } = renderHook(() => LandingController());

            await result.current.handleGoSignIn();

            expect(mockNavigate).toHaveBeenCalledWith('SignIn');
        });
    });

    describe('handleGoSignUp', () => {
        it('should navigate to SignUp screen', async () => {
            const { result } = renderHook(() => LandingController());

            await result.current.handleGoSignUp();

            expect(mockNavigate).toHaveBeenCalledWith('SignUp');
        });
    });
});
