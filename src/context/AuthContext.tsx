import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../types/auth';

type AuthContextValue = {
  user: AuthUser | null;
  loginUser: (user: AuthUser) => void;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
  initialUser?: AuthUser | null;
};

export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);

  const value = useMemo(
    () => ({
      user,
      loginUser: (nextUser: AuthUser) => setUser(nextUser),
      logoutUser: () => setUser(null),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}