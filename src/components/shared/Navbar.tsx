import {
  ChevronDown,
  LoaderCircle,
  LogIn,
  LogOut,
  Terminal,
  UserPlus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "../../features/auth/hooks/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth();
  const [logoutError, setLogoutError] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !profileMenuRef.current?.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
        profileButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileMenuOpen]);

  const handleLogout = async () => {
    setLogoutError("");
    setIsSigningOut(true);
    setIsProfileMenuOpen(false);

    try {
      await logout();
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Unable to sign out.",
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#080b14]/85 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto h-[72px] px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition">
            <Terminal size={23} className="text-white" />
          </div>

          <span className="text-xl font-bold tracking-tight text-white">
            Compiler
          </span>
        </button>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          <a
            href="#features"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Features
          </a>

          <a
            href="#languages"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Languages
          </a>

          <a
            href="#about"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            About
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!isLoading && user ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                ref={profileButtonRef}
                type="button"
                aria-expanded={isProfileMenuOpen}
                aria-controls="navbar-profile-menu"
                aria-label="Toggle profile menu"
                onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-2.5 text-left transition hover:border-blue-400/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 sm:gap-3 sm:pr-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-950/40">
                  {user.name.trim().charAt(0).toUpperCase() || "U"}
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span className="block max-w-32 truncate text-sm font-medium text-white">
                    {user.name}
                  </span>
                  <span className="block text-[11px] text-gray-400">
                    Your account
                  </span>
                </span>
                <ChevronDown
                  size={15}
                  aria-hidden="true"
                  className={`hidden text-gray-400 transition-transform sm:block ${
                    isProfileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileMenuOpen && (
                <div
                  id="navbar-profile-menu"
                  className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#101522] p-2 shadow-2xl shadow-black/50"
                >
                  <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-base font-bold text-white">
                      {user.name.trim().charAt(0).toUpperCase() || "U"}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-white">
                        {user.name}
                      </span>
                      <span className="block truncate text-xs text-gray-400">
                        {user.email}
                      </span>
                    </span>
                  </div>

                  <div className="my-2 h-px bg-white/[0.08]" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isSigningOut}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-red-400/10 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/60 disabled:cursor-wait disabled:opacity-60"
                  >
                    {isSigningOut ? (
                      <LoaderCircle
                        size={16}
                        aria-hidden="true"
                        className="animate-spin"
                      />
                    ) : (
                      <LogOut size={16} aria-hidden="true" />
                    )}
                    {isSigningOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              )}
            </div>
          ) : !isLoading ? (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:-translate-y-0.5 hover:from-blue-400 hover:to-indigo-400 hover:shadow-blue-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70"
              >
                <LogIn size={16} aria-hidden="true" />
                Sign in
              </Link>
              <Link
                to="/signup"
                className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 sm:inline-flex"
              >
                <UserPlus size={16} aria-hidden="true" />
                Create account
              </Link>
            </>
          ) : (
            <span
              aria-label="Checking sign-in status"
              className="h-10 w-24 animate-pulse rounded-full bg-white/[0.06]"
            />
          )}
        </div>
      </nav>
      {logoutError && (
        <div className="mx-auto max-w-7xl px-6 pb-3 md:px-10">
          <p
            role="alert"
            className="ml-auto w-fit rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-200"
          >
            {logoutError}
          </p>
        </div>
      )}
    </header>
  );
}

export default Navbar;
