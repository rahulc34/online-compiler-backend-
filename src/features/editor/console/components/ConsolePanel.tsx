import { Terminal } from "lucide-react";

function ConsolePanel() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#0b0e16]">
      <div className="text-center">
        <Terminal size={25} className="mx-auto mb-3 text-gray-600" />
        <p className="text-sm font-medium text-gray-400">Console</p>
        <p className="mt-1 text-xs text-gray-600">
          Console output is coming soon.
        </p>
      </div>
    </div>
  );
}

export default ConsolePanel;
