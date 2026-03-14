import { apiGet } from './client';
import type { LoginResponse, UserRole } from '../types/auth';

export function login(role: UserRole, password: string) {
  const params = new URLSearchParams({
    role,
    password,
  });

  return apiGet<LoginResponse>(`/auth/login?${params.toString()}`);
}