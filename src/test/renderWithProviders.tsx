import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import { theme } from '../app/theme';
import { AuthProvider } from '../context/AuthContext';
import type { AuthUser } from '../types/auth';

type RenderOptions = {
  // Optional authenticated user to preload into the test auth context.
  initialUser?: AuthUser | null;

  // Optional initial router entries for testing navigation and route rendering.
  initialEntries?: string[];
};

/**
 * Renders a component wrapped with the same providers used by the app.
 *
 * This helper sets up theme, React Query, authentication context,
 * and an in-memory router for component tests.
 */
export function renderWithProviders(
  ui: ReactElement,
  options: RenderOptions = {}
) {
  // Use default test values when custom render options are not provided.
  const { initialUser = null, initialEntries = ['/'] } = options;

  // Create a fresh QueryClient for each test to avoid shared cache state.
  const queryClient = new QueryClient({
    defaultOptions: {
      // Disable retries in tests to keep failures fast and deterministic.
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  // Render the UI wrapped with all required application providers.
  return render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider initialUser={initialUser}>
          <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}