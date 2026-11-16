import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import { ApiClientError } from "../../../services/api-client";
import { authApi } from "../services/auth.api";
import { AuthContext } from "./auth.context";
import type { AuthContextValue } from "./auth.context";
import type {
  AuthUser,
  LoginInput,
  SignupInput,
} from "../types/auth.types";

interface AuthProviderProps {
  children: ReactNode;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to check your session.";
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      if (error instanceof ApiClientError && error.statusCode === 401) {
        setUser(null);
        return null;
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    authApi
      .getCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch((error: unknown) => {
        if (!active) return;

        if (error instanceof ApiClientError && error.statusCode === 401) {
          setUser(null);
          return;
        }

        setUser(null);
        setAuthError(getErrorMessage(error));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(
    async (input: LoginInput) => {
      await authApi.login(input);
      const currentUser = await refreshUser();

      if (!currentUser) {
        throw new Error("Login succeeded, but the session could not be loaded.");
      }

      return currentUser;
    },
    [refreshUser],
  );

  const signup = useCallback(
    (input: SignupInput) => authApi.signup(input),
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
      setUser(null);
    } catch (error) {
      if (error instanceof ApiClientError && error.statusCode === 401) {
        setUser(null);
        return;
      }

      throw error;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      authError,
      login,
      signup,
      logout,
      refreshUser,
    }),
    [user, isLoading, authError, login, signup, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
