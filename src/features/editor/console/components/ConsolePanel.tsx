import { Terminal } from "lucide-react";

function ConsolePanel() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#0b0e16]">
      <div className="text-center">
        <Terminal size={25} className="mx-auto mb-3 text-violet-400" />
        <p className="text-sm font-medium text-violet-200">Console</p>
        <p className="mt-2 inline-flex rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300">
          Console output is coming soon.
        </p>
      </div>
    </div>
  );
}

export default ConsolePanel;
