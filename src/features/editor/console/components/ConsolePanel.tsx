import { useRef, useEffect } from "react";
import {
  Terminal,
  Trash2,
  Copy,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";

export interface ConsoleMessage {
  id: string;
  type: "output" | "error" | "system";
  text: string;
  timestamp: string;
}

interface ConsolePanelProps {
  messages: ConsoleMessage[];
  onClear: () => void;
}

function ConsolePanel({ messages, onClear }: ConsolePanelProps) {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleRef.current?.scrollTo({
      top: consoleRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const copyConsole = async () => {
    const content = messages.map((message) => message.text).join("\n");
    await navigator.clipboard.writeText(content);
  };

  const messageStyles = {
    output: {
      icon: Terminal,
      color: "text-gray-300",
      label: "OUTPUT",
    },
    error: {
      icon: AlertCircle,
      color: "text-red-400",
      label: "ERROR",
    },
    system: {
      icon: Info,
      color: "text-blue-400",
      label: "SYSTEM",
    },
  };

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-[#0b0e16]">
      {/* Console Header */}
      <div className="flex h-10 w-full shrink-0 items-center justify-between border-b border-[#252936] px-4">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-gray-500" />

          <span className="text-xs font-medium text-gray-300">
            Execution Logs
          </span>

          <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-gray-500">
            {messages.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={copyConsole}
            disabled={messages.length === 0}
            title="Copy console"
            className="rounded-md p-1.5 text-gray-500 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
          >
            <Copy size={13} />
          </button>

          <button
            onClick={onClear}
            disabled={messages.length === 0}
            title="Clear console"
            className="rounded-md p-1.5 text-gray-500 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Console Content */}
      <div
        ref={consoleRef}
        className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 font-mono"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
              <Terminal size={19} className="text-gray-600" />
            </div>

            <p className="text-xs font-medium text-gray-400">
              No execution logs yet
            </p>

            <p className="mt-1 text-[11px] text-gray-600">
              Run your code to see logs here.
            </p>
          </div>
        ) : (
          <div className="w-full space-y-3">
            {messages.map((message) => {
              const style = messageStyles[message.type];
              const Icon = style.icon;

              return (
                <div key={message.id} className="flex w-full gap-3">
                  <Icon
                    size={14}
                    className={`mt-0.5 shrink-0 ${style.color}`}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className={`text-[9px] font-semibold tracking-wider ${style.color}`}
                      >
                        {style.label}
                      </span>

                      <span className="text-[9px] text-gray-600">
                        {message.timestamp}
                      </span>
                    </div>

                    <pre
                      className={`whitespace-pre-wrap break-words text-[12px] leading-5 ${style.color}`}
                    >
                      {message.text}
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex h-8 w-full shrink-0 items-center gap-2 border-t border-[#252936] px-4">
        <CheckCircle2 size={12} className="text-emerald-500" />
        <span className="text-[10px] text-gray-500">Console ready</span>
      </div>
    </div>
  );
}

export default ConsolePanel;
