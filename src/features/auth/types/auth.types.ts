export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupResult {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
}

export interface LoginResult {
  id: string;
  name: string;
  email: string;
  role: string;
  sessionVersion: number;
}
