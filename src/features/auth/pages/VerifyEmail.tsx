import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import AuthLayout, { FormError } from "../components/AuthLayout";
import { authApi } from "../services/auth.api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      await authApi.verifyEmail({ email, otp });
      navigate("/login", {
        replace: true,
        state: { message: "Email verified. You can now sign in." },
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to verify your email. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    setIsResending(true);

    try {
      await authApi.resendOtp({ email });
      setMessage("A new verification code has been sent.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to resend the code. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      description="Enter the verification code sent to your email address."
    >
      <form onSubmit={handleVerify} className="space-y-4">
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

        <label className="block space-y-1.5 text-sm">
          <span className="text-gray-300">Verification code</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            value={otp}
            onChange={(event) =>
              setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="w-full rounded-lg border border-white/10 bg-[#080b14] px-3 py-2.5 tracking-[0.3em] outline-none focus:border-blue-500"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? "Verifying..." : "Verify email"}
        </button>

        <button
          type="button"
          disabled={!email || isResending}
          onClick={handleResend}
          className="w-full text-sm text-blue-400 hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isResending ? "Sending..." : "Resend verification code"}
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

export default VerifyEmail;
