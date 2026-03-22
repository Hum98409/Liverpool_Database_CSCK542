import { apiGet } from './client';
import type { LoginResponse, UserRole } from '../types/auth';

/**
 * Sends a login request for the given role and password.
 *
 * Builds a query string from the credentials and calls the auth endpoint,
 * returning the typed login response from the API client.
 */
export function login(role: UserRole, password: string) {
  // Convert login inputs into URL query parameters.
  const params = new URLSearchParams({
    role,
    password,
  });

  // Request the login endpoint and return the parsed response.
  return apiGet<LoginResponse>(`/auth/login?${params.toString()}`);
}