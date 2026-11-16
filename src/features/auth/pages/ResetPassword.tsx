import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import AuthLayout, { FormError } from "../components/AuthLayout";
import { authApi } from "../services/auth.api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.resetPassword({ token, password, confirmPassword });
      setIsComplete(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to reset your password. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Choose a new password"
      description="Set a new password for your account."
    >
      {isComplete ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-green-300">Your password has been reset.</p>
          <Link
            to="/login"
            className="inline-block rounded-lg bg-blue-600 px-4 py-2.5 font-semibold hover:bg-blue-500"
          >
            Sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormError
            message={
              error ||
              (!token
                ? "This password-reset link is missing its token."
                : "")
            }
          />

          <label className="block space-y-1.5 text-sm">
            <span className="text-gray-300">New password</span>
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={!token}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#080b14] px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </label>

          <label className="block space-y-1.5 text-sm">
            <span className="text-gray-300">Confirm password</span>
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={!token}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#080b14] px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </label>

          <button
            type="submit"
            disabled={!token || isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update password"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

export default ResetPassword;
