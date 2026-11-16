import { createContext } from "react";

import type {
  AuthUser,
  LoginInput,
  SignupInput,
  SignupResult,
} from "../types/auth.types";

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  authError: string | null;
  login: (input: LoginInput) => Promise<AuthUser>;
  signup: (input: SignupInput) => Promise<SignupResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
