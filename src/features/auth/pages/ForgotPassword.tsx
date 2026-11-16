import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout, { FormError } from "../components/AuthLayout";
import { authApi } from "../services/auth.api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      await authApi.forgotPassword({ email });
      setMessage("If an account exists for this email, reset instructions were sent.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to request a password reset. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      description="We will send reset instructions to your email."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormError message={error} />
        {message && (
          <p className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-300">
            {message}
          </p>
        )}

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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send reset instructions"}
        </button>

        <p className="text-center text-sm text-gray-400">
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default ForgotPassword;
