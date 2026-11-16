import { useState } from "react";
import { Download, Copy, Terminal, Check } from "lucide-react";

interface OutputPanelProps {
  output?: string;
}

function OutputPanel({ output = "" }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const hasOutput = output.length > 0;

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
      {/* Header */}
      <div className="flex h-[50px] shrink-0 items-center justify-between border-b border-[#292a30] px-4">
        <h2 className="text-lg font-medium">Output</h2>

        <div className="flex items-center gap-4">
          {/* Download */}
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

          {/* Copy */}
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

      {/* Output Content */}
      <div className="flex min-h-0 flex-1 overflow-auto p-6">
        {hasOutput ? (
          <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-6 text-gray-200">
            {output}
          </pre>
        ) : (
          <div className="m-auto flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-[#292a30] text-gray-500">
              <Terminal size={23} />
            </div>

            <h3 className="text-base font-semibold text-white">Ready to Run</h3>

            <p className="mt-2 max-w-[260px] text-sm leading-6 text-gray-500">
              Write your code and click Run to see the output here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
