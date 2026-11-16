import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Terminal } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080b14] px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#111521] p-7 shadow-2xl shadow-black/30 sm:p-9">
        <Link to="/" className="mb-8 flex items-center justify-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-700">
            <Terminal size={22} />
          </span>
          <span className="text-xl font-bold">Compiler</span>
        </Link>

        <h1 className="text-center text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-center text-sm text-gray-400">{description}</p>

        <div className="mt-7">{children}</div>
      </section>
    </main>
  );
}

export function FormError({ message }: { message: string }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
    >
      {message}
    </p>
  );
}
