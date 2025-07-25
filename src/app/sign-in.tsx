import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { useSession } from "../state/AuthContext";
import { supabase } from "../utils/supabase";

const SignIn = () => {
    const { signIn } = useSession();
    const [hasUserAccess, setHasUserAccess] = useState(false);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "TU_GOOGLE_SIGN_IN",
        });
    }, []);

    const handleSignInPress = async () => {
        try {
            const hasPlayServices = await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });

            if (!hasPlayServices) {
                console.log('Ha ocurrido un error, el usuario no tiene play services');
                return;
            }

            const { type, data } = await GoogleSignin.signIn();

            if (type === "cancelled") {
                console.error('El usuario ha cancelado la peticion');
                return;
            }
            
            if (!data?.idToken) {
                console.error('Ha ocurrido un error al obtener el token');
                return;
            }

            const { data: supabaseData, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: data?.idToken
            });

            if (error) {
                console.error('Ha ocurrido un error al iniciar sesion en supabase ', error);
                return;
            }

            signIn(supabaseData.session.access_token);
            router.push('/(auth)/(tabs)');
        } catch (error) {
            console.error('Ha ocurrido un error con la peticion de Sign In: ', error);
        }
    };

    const handleBiometricPress = async () => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (hasHardware && isEnrolled) {

                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: "Necesitas confirmar tu identidad para seguir"
                });

                if (result.success) {
                    setHasUserAccess(true);
                }
            }
        } catch (error) {
            console.error('Ha ocurrido un error al acceder a la biometria', error)
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 24 }}>Hola React Native</Text>
            {hasUserAccess ? <GoogleSigninButton onPress={handleSignInPress} /> : <Button title="Biometria" onPress={handleBiometricPress} />}
        </View>
    );
};

export default SignIn;