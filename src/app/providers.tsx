import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { ReactNode } from 'react';
import { theme } from './theme';
import { AuthProvider } from '../context/AuthContext';

// Create a single shared React Query client for managing server state and caching.
const queryClient = new QueryClient();

/**
 * Wraps the application with shared providers.
 *
 * This includes the Material UI theme, baseline CSS reset,
 * React Query client, and authentication context.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    // Provide the custom Material UI theme to all nested components.
    <ThemeProvider theme={theme}>
      {/* Apply Material UI's baseline styles for consistent default rendering. */}
      <CssBaseline />

      {/* Provide React Query features such as caching, fetching, and synchronization. */}
      <QueryClientProvider client={queryClient}>
        {/* Provide authentication state and actions to the application. */}
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}