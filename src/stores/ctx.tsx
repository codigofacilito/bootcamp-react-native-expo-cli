import { createContext, PropsWithChildren, use } from 'react';
import { useStorageState } from './useStorageState';

const AuthContext = createContext<{
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  const handleSignIn = (token: string) => {
    setSession(token);
  };

  return (
    <AuthContext
      value={{
        signIn: handleSignIn,
        signOut: () => setSession(null),
        session,
        isLoading,
      }}>
      {children}
    </AuthContext>
  );
}