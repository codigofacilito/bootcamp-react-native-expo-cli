import {
  GoogleSignin,
  GoogleSigninButton
} from '@react-native-google-signin/google-signin';
import * as LocalAuthentication from 'expo-local-authentication';
import { View } from 'react-native';
import { supabase } from '../utils/supabase';

import { useSession } from '@/src/stores/ctx';
import { useEffect } from 'react';

export default function SignIn() {
  const { signIn, } = useSession();

  useEffect(() => {
    GoogleSignin.configure({
        webClientId: "912136611396-rcoju8bq3ephqc6di6753su35llffaj5.apps.googleusercontent.com",
    });
  }, [])

  const handleStartSignInFlow = async () => {
    try {
      const hasPlayServices = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

     if (hasPlayServices) {
        const signInResponse = await GoogleSignin.signIn();
        
        if (signInResponse.type === "success") {
            const { idToken } = signInResponse.data;
            
            if (!idToken) {
                return;
            }
            
             const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: idToken,
            });

            if (error) {
                // Handle error
            }

            const { session: { access_token }} = data;

            signIn(access_token);
        }
     }
    } catch (error) {
      console.error('Error checking sign-in status:', error);
    }
  };

  // Test this
  const handleLocalAuthPress = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (hasHardware && isEnrolled) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autentícate para continuar',
    });

    if (result.success) {
        console.log(result, 1010);
      // usuario autenticado
    }
  }
};

 
return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <GoogleSigninButton onPress={handleStartSignInFlow} />
    </View>
  );
}