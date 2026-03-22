import { apiPost } from './client';
import type { LoginResponse, UserRole } from '../types/auth';

/**
 * Sends a login request for the given role and password.
 *
 * Sends a POST request with credentials as JSON body,
 * returning the typed login response from the API client.
 */
export function login(role: UserRole, password: string) {
  // Send credentials as JSON body via POST
  return apiPost<LoginResponse>('/auth/login', { role, password });
}