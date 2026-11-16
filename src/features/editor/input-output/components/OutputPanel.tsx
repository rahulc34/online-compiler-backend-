import { useState } from "react";
import { Download, Copy, Terminal, Check, X } from "lucide-react";

import type { ExecutionViewState } from "../../hooks/useExecution";

interface OutputPanelProps {
  execution: ExecutionViewState;
  onCancel: () => void;
}

const STATUS_LABELS: Record<ExecutionViewState["status"], string> = {
  idle: "Ready",
  submitting: "Submitting",
  queued: "Queued",
  running: "Running",
  cancelling: "Cancelling",
  cancelled: "Cancelled",
  success: "Success",
  compilation_error: "Compilation error",
  runtime_error: "Runtime error",
  timeout: "Timed out",
  internal_error: "Execution error",
};

function OutputPanel({ execution, onCancel }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const stdout = execution.result?.stdout ?? "";
  const stderr = execution.result?.stderr ?? "";
  const output = [stdout, stderr, execution.error].filter(Boolean).join("\n");
  const hasOutput = output.length > 0;
  const canCancel =
    execution.status === "queued" || execution.status === "running";

  const handleCopy = async () => {
    if (!hasOutput) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);

      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!hasOutput) return;

    const blob = new Blob([output], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "output.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-[#191a20] bg-[#141418]">
      <div className="flex h-[50px] shrink-0 items-center justify-between border-b border-[#292a30] px-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-medium">Output</h2>
          <span
            aria-live="polite"
            className={`rounded-md px-2 py-1 text-[11px] ${
              execution.status === "success"
                ? "bg-emerald-500/10 text-emerald-300"
                : execution.status === "compilation_error" ||
                    execution.status === "runtime_error" ||
                    execution.status === "timeout" ||
                    execution.status === "internal_error"
                  ? "bg-red-500/10 text-red-300"
                  : "bg-white/[0.06] text-gray-400"
            }`}
          >
            {STATUS_LABELS[execution.status]}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {canCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={execution.isCancelling}
              title="Cancel execution"
              className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-red-300 disabled:cursor-wait disabled:opacity-50"
            >
              <X size={14} />
              {execution.isCancelling ? "Cancelling..." : "Cancel"}
            </button>
          )}
          <button
            type="button"
            onClick={handleDownload}
            disabled={!hasOutput}
            title={hasOutput ? "Download output" : "No output to download"}
            className={`transition ${
              hasOutput
                ? "cursor-pointer text-gray-400 hover:text-white"
                : "cursor-not-allowed text-gray-600 opacity-40"
            }`}
          >
            <Download size={16} />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!hasOutput}
            title={hasOutput ? "Copy output" : "No output to copy"}
            className={`transition ${
              hasOutput
                ? "cursor-pointer text-gray-400 hover:text-white"
                : "cursor-not-allowed text-gray-600 opacity-40"
            }`}
          >
            {copied ? (
              <Check size={16} className="text-green-400" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </div>

      <div
        className={`min-h-0 flex-1 overflow-auto p-5 ${
          execution.status === "idle" && !hasOutput ? "flex" : ""
        }`}
      >
        {execution.status === "idle" && !hasOutput ? (
          <div className="m-auto flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-[#292a30] text-gray-500">
              <Terminal size={23} />
            </div>

            <h3 className="text-base font-semibold text-white">Ready to Run</h3>

            <p className="mt-2 max-w-[260px] text-sm leading-6 text-gray-500">
              Write your code and click Run to see the output here.
            </p>
          </div>
        ) : (
          <div className="space-y-4 font-mono text-sm leading-6">
            {execution.status === "submitting" && (
              <p className="text-gray-400">Submitting your code...</p>
            )}
            {execution.status === "queued" && (
              <p className="text-gray-400">Waiting for an execution worker...</p>
            )}
            {execution.status === "running" && !stdout && !stderr && (
              <p className="text-gray-400">Your program is running...</p>
            )}
            {execution.status === "cancelling" && (
              <p className="text-gray-400">Stopping your program...</p>
            )}
            {stdout && (
              <pre className="whitespace-pre-wrap break-words text-gray-200">
                {stdout}
              </pre>
            )}
            {stderr && (
              <pre className="whitespace-pre-wrap break-words text-red-300">
                {stderr}
              </pre>
            )}
            {execution.error && (
              <pre role="alert" className="whitespace-pre-wrap break-words text-red-300">
                {execution.error}
              </pre>
            )}
            {execution.result && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-white/[0.08] pt-3 text-xs text-gray-500">
                {execution.result.compilationTime !== undefined && (
                  <span>
                    Compile: {execution.result.compilationTime} ms
                  </span>
                )}
                {execution.result.executionTime !== undefined && (
                  <span>
                    Run: {execution.result.executionTime} ms
                  </span>
                )}
                {execution.result.memoryUsed !== undefined && (
                  <span>
                    Memory: {Math.round(execution.result.memoryUsed / 1024)} KB
                  </span>
                )}
                {execution.result.exitCode !== undefined &&
                  execution.result.exitCode !== null && (
                    <span>Exit code: {execution.result.exitCode}</span>
                  )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
