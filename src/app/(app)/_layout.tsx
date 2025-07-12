import { useSession } from "@/src/stores/ctx";
import { Redirect, Stack } from "expo-router";
import { Text } from "react-native";

export default function AppLayout() {
    const { session, isLoading } = useSession();

    if (isLoading) {
        return <Text>Cargando...</Text>
    }

    if (!session) {
        return <Redirect href="/sign-in" />
    }

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}