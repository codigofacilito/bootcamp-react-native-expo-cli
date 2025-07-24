import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import SignIn from '../app/sign-in';
import { useSession } from '../state/AuthContext';
import { supabase } from '../utils/supabase';

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
  },
  GoogleSigninButton: ({ onPress, ...props }: any) => {
      const { Pressable, Text } = require('react-native');
     return (
      <Pressable onPress={onPress} testID="google-signin-button" {...props}>
        <Text>Sign in with Google</Text>
      </Pressable>
    );
  },
}));

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
  authenticateAsync: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('../state/AuthContext', () => ({
  useSession: jest.fn(),
}));

jest.mock('../utils/supabase', () => ({
  supabase: {
    auth: {
      signInWithIdToken: jest.fn(),
    },
  },
}));

const clearAllMocks = () => {
  jest.clearAllMocks();
  console.log = jest.fn();
  console.error = jest.fn();
};

describe("Sign In Integration Tests", () => {
  const mockSignIn = jest.fn();

    beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
    
    (useSession as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
    });
  });

  describe("Flujo completo de biometria + Google Sign In", () => {
        it('debe completar el flujo exitoso: biometría → Google Sign In → navegación', async () => {
            // Arrange: Configurar mocks para flujo exitoso
            (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
            (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
            (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({
                success: true,
            });

            (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true);
            (GoogleSignin.signIn as jest.Mock).mockResolvedValue({
                type: 'success',
                data: {
                idToken: 'mock-id-token-123',
                user: { email: 'test@example.com' },
                },
            });

            (supabase.auth.signInWithIdToken as jest.Mock).mockResolvedValue({
                data: {
                    session: {
                        access_token: 'mock-access-token-456',
                    },
                },
                error: null,
            });

            const screen = render(<SignIn />);

            // Assert: Verificar estado inicial
            expect(screen.getByText('Hola React Native')).toBeTruthy();
            expect(screen.getByText('Biometria')).toBeTruthy();
            expect(screen.queryByTestId('google-signin-button')).toBeNull();

            // Act: Activar autenticación biométrica
            const biometricButton = screen.getByText('Biometria');
            fireEvent.press(biometricButton);


            // Assert: Esperar a que aparezca el botón de Google
            await waitFor(() => {
                expect(screen.getByTestId('google-signin-button')).toBeTruthy();
            });

            // Assert: Verificar que se oculta el botón de biometría
            expect(screen.queryByText('Biometria')).toBeNull();


            // Act: Activar Google Sign In
            const googleButton = screen.getByTestId('google-signin-button');
            fireEvent.press(googleButton);

            await waitFor(() => {
            expect(GoogleSignin.hasPlayServices).toHaveBeenCalledWith({
                showPlayServicesUpdateDialog: true,
            });
            expect(GoogleSignin.signIn).toHaveBeenCalled();
            expect(supabase.auth.signInWithIdToken).toHaveBeenCalledWith({
                provider: 'google',
                token: 'mock-id-token-123',
            });
            expect(mockSignIn).toHaveBeenCalledWith('mock-access-token-456');
            expect(router.push).toHaveBeenCalledWith('/(auth)/(tabs)');
        });
    });
  });

  describe("Manejo de errores en el flujo de integracion", () => {
    it('debe manejar fallo en biometría y mantener botón biométrico', async () => {
        // Arrange
        LocalAuthentication.hasHardwareAsync.mockResolvedValue(true);
        LocalAuthentication.isEnrolledAsync.mockResolvedValue(true);
        LocalAuthentication.authenticateAsync.mockResolvedValue({
            success: false,
        });

        const screen = render(<SignIn />);
        const biometricButton = screen.getByText('Biometria');
        fireEvent.press(biometricButton);

        await waitFor(() => {
            expect(screen.getByText('Biometria')).toBeTruthy();
            expect(screen.queryByTestId('google-signin-button')).toBeNull();
        });
    });

    it('debe manejar error cuando usuario cancela Google Sign In', async () => {
        LocalAuthentication.hasHardwareAsync.mockResolvedValue(true);
        LocalAuthentication.isEnrolledAsync.mockResolvedValue(true);
        LocalAuthentication.authenticateAsync.mockResolvedValue({ success: true });

        GoogleSignin.hasPlayServices.mockResolvedValue(true);
        GoogleSignin.signIn.mockResolvedValue({
            type: 'cancelled',
            data: null,
        });

        const screen = render(<SignIn />);

        // Completar biometría
        const biometricButton = screen.getByText('Biometria');
        fireEvent.press(biometricButton);

        await waitFor(() => {
            expect(screen.getByTestId('google-signin-button')).toBeTruthy();
        });

        // Intentar Google Sign In
        const googleButton = screen.getByTestId('google-signin-button');
        fireEvent.press(googleButton);

        // Assert
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('El usuario ha cancelado la peticion');
            expect(mockSignIn).not.toHaveBeenCalled();
            expect(router.push).not.toHaveBeenCalled();
        });
    });
  });
});