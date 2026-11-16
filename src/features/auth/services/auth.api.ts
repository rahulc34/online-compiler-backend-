import { API_BASE_URL, apiRequest } from "../../../services/api-client";

import type {
  AuthUser,
  LoginResult,
  LoginInput,
  SignupInput,
  SignupResult,
} from "../types/auth.types";

let currentUserRequest: Promise<AuthUser> | null = null;

function getCurrentUser(): Promise<AuthUser> {
  if (currentUserRequest) return currentUserRequest;

  const request = apiRequest<AuthUser>("/auth/me");
  const sharedRequest = request.finally(() => {
    if (currentUserRequest === sharedRequest) {
      currentUserRequest = null;
    }
  });

  currentUserRequest = sharedRequest;
  return sharedRequest;
}

export const authApi = {
  signup: (input: SignupInput) =>
    apiRequest<SignupResult>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  login: (input: LoginInput) =>
    apiRequest<LoginResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  logout: () =>
    apiRequest<null>("/auth/logout", {
      method: "POST",
    }),

  getCurrentUser,

  verifyEmail: (input: { email: string; otp: string }) =>
    apiRequest<null>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  resendOtp: (input: { email: string }) =>
    apiRequest<null>("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  forgotPassword: (input: { email: string }) =>
    apiRequest<null>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  resetPassword: (input: {
    token: string;
    password: string;
    confirmPassword: string;
  }) =>
    apiRequest<null>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  googleAuthUrl: `${API_BASE_URL}/auth/google`,
};
