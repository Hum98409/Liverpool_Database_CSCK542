import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import { theme } from '../app/theme';
import { AuthProvider } from '../context/AuthContext';
import type { AuthUser } from '../types/auth';

type RenderOptions = {
  initialUser?: AuthUser | null;
  initialEntries?: string[];
};

export function renderWithProviders(
  ui: ReactElement,
  options: RenderOptions = {}
) {
  const { initialUser = null, initialEntries = ['/'] } = options;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

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