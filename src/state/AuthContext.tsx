import * as SecureStore from 'expo-secure-store';
import { createContext, FC, PropsWithChildren, use, useEffect, useState } from "react";

const initialState = {
    signIn: () => null,
    signOut: () => null,
    session: null,
    loading: false,
};

type AuthContextTypes = {
    signIn: (token: string) => void;
    signOut: () => void;
    session?: string | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextTypes>(initialState);

export const useSession = () => {
    const value = use(AuthContext);

    if (!value) {
        console.error('Ha ocurrido un error con el hook de Auth')
    }

    return value;
};

export const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
    const [session, setSession] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getInitialValue = async () => {
            setLoading(true);
            const token = await SecureStore.getItemAsync("token");
            setSession(token ?? null);
            setLoading(false);
        };

        getInitialValue();
    }, []);

    const handleSignIn = async (token: string) => {
        try {
            setLoading(true);

            const currentToken = await SecureStore.getItemAsync("token");

            if (!!currentToken) {
                setLoading(false);
                return;
            }

            await SecureStore.setItemAsync("token", token);
            setSession(token);
        } catch (error) {
            console.error('Ha ocurrido un error al autenticar al usuario', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            setLoading(true);
            setSession(null);
            await SecureStore.deleteItemAsync("token");    
        } catch (error) {
            console.error('Ha ocurrido un error al cerrar sesion', error);
        } finally {
            setLoading(false);
        }

    };

    return (
        <AuthContext
            value={{
                signIn: handleSignIn,
                signOut: handleSignOut,
                session,
                loading,
            }}
        >
            {children}
        </AuthContext>
    );
};