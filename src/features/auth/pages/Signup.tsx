import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout, { FormError } from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";
import { authApi } from "../services/auth.api";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitInFlight = useRef(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitInFlight.current) return;

    submitInFlight.current = true;
    setError("");
    setIsSubmitting(true);

    try {
      const result = await signup({ name, email, password });
      navigate(`/verify-email?email=${encodeURIComponent(result.email)}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      submitInFlight.current = false;
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    setError("");

    try {
      window.location.assign(authApi.googleAuthUrl);
    } catch {
      setError("Unable to start Google sign-up. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Verify your email before signing in."
    >
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormError message={error} />

          <label className="block space-y-1.5 text-sm">
            <span className="text-gray-300">Name</span>
            <input
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#080b14] px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </label>

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
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#080b14] px-3 py-2.5 outline-none focus:border-blue-500"
            />
            <span className="block text-xs text-gray-500">
              Use at least 8 characters.
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Already registered?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Sign in
          </Link>
        </p>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="h-px flex-1 bg-white/10" />
          or continue with
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-medium transition hover:border-white/25 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 disabled:cursor-wait disabled:opacity-50"
        >
          Continue with Google
        </button>
      </div>
    </AuthLayout>
  );
}

export default Signup;
