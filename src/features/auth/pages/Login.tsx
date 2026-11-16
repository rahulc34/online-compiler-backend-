import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import AuthLayout, { FormError } from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";
import { authApi } from "../services/auth.api";
import { AUTH_RETURN_PATH_KEY, getSafeReturnPath } from "../utils/auth-navigation";

interface LoginLocationState {
  returnTo?: string;
  message?: string;
}

function Login() {
  const { authError, isLoading: isAuthLoading, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationState = location.state as LoginLocationState | null;
  const returnTo = getSafeReturnPath(locationState?.returnTo);
  const oauthError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      sessionStorage.removeItem(AUTH_RETURN_PATH_KEY);
      navigate(returnTo, { replace: true });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      sessionStorage.setItem(AUTH_RETURN_PATH_KEY, returnTo);
      window.location.assign(authApi.googleAuthUrl);
    } catch {
      setError("Unable to start Google sign-in. Please try again.");
    }
  };

  return (
    <AuthLayout title="Welcome back" description="Sign in to run your code.">
      <div className="space-y-4">
        {locationState?.message && (
          <p className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-300">
            {locationState.message}
          </p>
        )}
        {authError && <FormError message={authError} />}
        {oauthError && (
          <FormError message={`Google sign-in failed (${oauthError}). Please try again.`} />
        )}
        <FormError message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-1.5 text-sm">
            <span className="text-gray-300">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#080b14] px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </label>

          <label className="block space-y-1.5 text-sm">
            <span className="text-gray-300">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#080b14] px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </label>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isAuthLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting
              ? "Signing in..."
              : isAuthLoading
                ? "Checking session..."
                : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300">
            Sign up
          </Link>
        </p>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="h-px flex-1 bg-white/10" />
          or continue with
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isAuthLoading}
          className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-medium transition hover:border-white/25 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 disabled:cursor-wait disabled:opacity-50"
        >
          Continue with Google
        </button>
      </div>
    </AuthLayout>
  );
}

export default Login;
