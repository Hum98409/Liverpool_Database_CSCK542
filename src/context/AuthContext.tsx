import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../types/auth';

type AuthContextValue = {
  // The currently authenticated user, or null when no user is logged in.
  user: AuthUser | null;

  // Stores the authenticated user in context.
  loginUser: (user: AuthUser) => void;

  // Clears the authenticated user from context.
  logoutUser: () => void;
};

// Create the authentication context with an undefined default
// so misuse outside the provider can be detected.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  // Nested components that should have access to auth state.
  children: ReactNode;

  // Optional initial user value, useful for testing or preloaded auth state.
  initialUser?: AuthUser | null;
};

/**
 * Provides authentication state and actions to descendant components.
 *
 * Manages the current user in local state and exposes memoized
 * login and logout helpers through React context.
 */
export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  // Store the current authenticated user in component state.
  const [user, setUser] = useState<AuthUser | null>(initialUser);

  // Memoize the context value to avoid unnecessary re-renders in consumers.
  const value = useMemo(
    () => ({
      user,
      // Update the current authenticated user.
      loginUser: (nextUser: AuthUser) => setUser(nextUser),
      // Clear the current authenticated user.
      logoutUser: () => setUser(null),
    }),
    [user]
  );

  // Make the auth state and actions available to all nested children.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Returns the current authentication context.
 *
 * Throws an error when used outside of an AuthProvider.
 */
export function useAuth() {
  // Read the auth context value from the nearest provider.
  const context = useContext(AuthContext);

  // Guard against usage outside the provider tree.
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Return the authenticated user state and auth actions.
  return context;
}