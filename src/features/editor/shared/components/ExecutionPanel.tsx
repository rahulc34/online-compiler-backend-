import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight,
  ChevronDown,
  LoaderCircle,
  LogIn,
  LogOut,
  Terminal,
  SquareTerminal,
} from "lucide-react";
import { Link } from "react-router-dom";

import InputOutputPanel from "../../input-output/components/InputOutputPanel";
import ConsolePanel from "../../console/components/ConsolePanel";
import type { ExecutionViewState } from "../../hooks/useExecution";
import { useAuth } from "../../../auth/hooks/useAuth";

export type ExecutionPanelTab = "io" | "console" | "terminal";

interface ExecutionPanelProps {
  input: string;
  onInputChange: (value: string) => void;
  execution: ExecutionViewState;
  onCancel: () => void;
  onActiveTabChange: (tab: ExecutionPanelTab) => void;
}

const tabs = [
  { id: "io", label: "I/O", icon: ArrowLeftRight },
  { id: "console", label: "Console", icon: Terminal },
  { id: "terminal", label: "Terminal", icon: SquareTerminal },
] as const;

function ExecutionPanel({
  input,
  onInputChange,
  execution,
  onCancel,
  onActiveTabChange,
}: ExecutionPanelProps) {
  const [activeTab, setActiveTab] = useState<ExecutionPanelTab>("io");
  const { user, isLoading, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
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

  const selectTab = (tab: ExecutionPanelTab) => {
    setActiveTab(tab);
    onActiveTabChange(tab);
  };

  const handleLogout = async () => {
    setLogoutError("");
    setIsSigningOut(true);

    try {
      await logout();
      setIsProfileMenuOpen(false);
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Unable to sign out.",
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {/* Panel Navigation */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-[#252936] px-3">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => selectTab(tab.id)}
                className={`relative flex h-8 shrink-0 items-center gap-2 rounded-md px-3 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#202633] text-white"
                    : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-300"
                }`}
              >
                <Icon size={14} />
                {tab.label}

                {isActive && (
                  <span className="absolute inset-x-2 -bottom-[9px] h-[2px] rounded-full bg-blue-500" />
                )}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center">
          {isLoading ? (
            <span
              aria-label="Loading account"
              className="h-8 w-8 animate-pulse rounded-full bg-[#202633]"
            />
          ) : user ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                ref={profileButtonRef}
                type="button"
                aria-expanded={isProfileMenuOpen}
                aria-controls="editor-profile-menu"
                aria-label={
                  isProfileMenuOpen ? "Close account menu" : "Open account menu"
                }
                onClick={() => {
                  setLogoutError("");
                  setIsProfileMenuOpen((isOpen) => !isOpen);
                }}
                className="flex h-8 max-w-36 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-2 transition hover:border-blue-400/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-[10px] font-bold text-white">
                  {user.name.trim().charAt(0).toUpperCase() || "U"}
                </span>
                <span className="hidden truncate text-xs font-medium text-gray-300 xl:block">
                  {user.name}
                </span>
                <ChevronDown
                  size={12}
                  aria-hidden="true"
                  className={`text-gray-400 transition-transform ${
                    isProfileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileMenuOpen && (
                <div
                  id="editor-profile-menu"
                  className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-white/10 bg-[#101522] p-2 shadow-2xl shadow-black/50"
                >
                  <div className="rounded-lg bg-white/[0.04] px-3 py-2.5">
                    <p className="truncate text-sm font-medium text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {user.email}
                    </p>
                  </div>

                  {logoutError && (
                    <p
                      role="alert"
                      className="px-3 py-2 text-xs text-red-300"
                    >
                      {logoutError}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isSigningOut}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-red-400/10 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/60 disabled:cursor-wait disabled:opacity-60"
                  >
                    {isSigningOut ? (
                      <LoaderCircle
                        size={14}
                        aria-hidden="true"
                        className="animate-spin"
                      />
                    ) : (
                      <LogOut size={14} aria-hidden="true" />
                    )}
                    {isSigningOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              state={{ returnTo: "/editor" }}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs font-medium text-gray-300 transition hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
            >
              <LogIn size={14} aria-hidden="true" />
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Active Panel */}
      {/* Panel Content */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          className={`absolute inset-0 ${
            activeTab === "io" ? "visible" : "invisible"
          }`}
        >
          <InputOutputPanel
            input={input}
            setInput={onInputChange}
            execution={execution}
            onCancel={onCancel}
          />
        </div>

        <div
          className={`absolute inset-0 ${
            activeTab === "console" ? "visible" : "invisible"
          }`}
        >
          <ConsolePanel />
        </div>

        <div
          className={`absolute inset-0 ${
            activeTab === "terminal" ? "visible" : "invisible"
          }`}
        >
          <div className="flex h-full items-center justify-center bg-[#0b0e16]">
            <div className="text-center">
              <SquareTerminal
                size={25}
                className="mx-auto mb-3 text-gray-600"
              />
              <p className="text-sm font-medium text-gray-400">Terminal</p>
              <p className="mt-1 text-xs text-gray-600">
                Interactive terminal coming soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExecutionPanel;
