import { useSession } from "@/src/state/AuthContext";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator } from "react-native";

const AuthLayout = () => {
    const { loading, session } = useSession();

    if (loading) {
        return <ActivityIndicator size="large" color="#fff" />;
    }

    if (!session) {
        return <Redirect href="/sign-in" />;
    }

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
        </Stack>
    );    
};

export default AuthLayout;