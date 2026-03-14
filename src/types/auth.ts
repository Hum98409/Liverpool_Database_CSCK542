export type UserRole = 'teacher' | 'student' | 'non_academic_staff';

export type AuthUser = {
  role: UserRole;
};

export type LoginRequest = {
  role: UserRole;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
};