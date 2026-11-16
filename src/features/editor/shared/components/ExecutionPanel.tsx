import { useState } from "react";
import { ArrowLeftRight, Terminal, SquareTerminal } from "lucide-react";

import InputOutputPanel from "../../input-output/components/InputOutputPanel";
import ConsolePanel from "../../console/components/ConsolePanel";
import type { ExecutionViewState } from "../../hooks/useExecution";

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

  const selectTab = (tab: ExecutionPanelTab) => {
    setActiveTab(tab);
    onActiveTabChange(tab);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {/* Panel Navigation */}
      <div className="flex h-12 shrink-0 items-center gap-1 border-[#252936] px-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => selectTab(tab.id)}
              className={`relative flex h-8 items-center gap-2 rounded-md px-3 text-xs font-medium transition-colors ${
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
