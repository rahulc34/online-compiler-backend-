import {
  X,
  RotateCcw,
  Type,
  Palette,
  Code2,
  Minus,
  Plus,
  Check,
  Settings2,
  AlignLeft,
  Sparkles,
} from "lucide-react";

import type { EditorSettings } from "../types/editor-settings.types";

interface EditorSettingsModalProps {
  settings: EditorSettings;
  onChange: (settings: EditorSettings) => void;
  onClose: () => void;
  onReset: () => void;
}

const themes = [
  {
    id: "github-dark",
    name: "GitHub Dark",
    description: "Balanced dark theme",
    background: "#0d1117",
    foreground: "#c9d1d9",
    accent: "#58a6ff",
  },
  {
    id: "monokai",
    name: "Monokai",
    description: "Classic vibrant theme",
    background: "#272822",
    foreground: "#f8f8f2",
    accent: "#a6e22e",
  },
  {
    id: "light",
    name: "Light",
    description: "Clean light appearance",
    background: "#ffffff",
    foreground: "#24292f",
    accent: "#0969da",
  },
] as const;

function EditorSettingsModal({
  settings,
  onChange,
  onClose,
  onReset,
}: EditorSettingsModalProps) {
  const updateSetting = <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K],
  ) => {
    onChange({ ...settings, [key]: value });
  };

  const sectionTitle =
    "mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500";

  const labelClass = "text-[13px] font-medium text-gray-200";
  const descriptionClass = "mt-1 text-xs text-gray-500";

  const selectClass =
    "w-40 rounded-lg border border-white/[0.09] bg-[#171a23] px-3 py-2 text-xs text-gray-200 outline-none transition hover:border-white/20 focus:border-blue-500/70";

  const Toggle = ({
    checked,
    onClick,
  }: {
    checked: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onClick}
      className={`relative h-[22px] w-10 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? "bg-blue-500" : "bg-[#343741]"
      }`}
    >
      <span
        className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
          checked ? "left-[21px]" : "left-[3px]"
        }`}
      />
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-[620px] flex-col overflow-hidden rounded-2xl border border-white/[0.10] bg-[#101219] text-white shadow-[0_25px_100px_rgba(0,0,0,0.65)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
              <Settings2 size={19} />
            </div>

            <div>
              <h2 className="text-[15px] font-semibold tracking-tight">
                Editor Settings
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Customize your coding environment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close settings"
            className="rounded-lg border border-transparent p-2 text-gray-500 transition hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-7 overflow-y-auto px-6 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Typography */}
          <section>
            <h3 className={sectionTitle}>
              <Type size={14} />
              Typography
            </h3>

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4">
              {/* Font size */}
              <div className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className={labelClass}>Font size</p>
                  <p className={descriptionClass}>
                    Adjust the editor text size
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#171a23] p-1">
                  <button
                    disabled={settings.fontSize <= 8}
                    onClick={() =>
                      updateSetting("fontSize", settings.fontSize - 1)
                    }
                    className="rounded-md p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="w-12 text-center font-mono text-xs text-white">
                    {settings.fontSize}px
                  </span>

                  <button
                    disabled={settings.fontSize >= 32}
                    onClick={() =>
                      updateSetting("fontSize", settings.fontSize + 1)
                    }
                    className="rounded-md p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="border-t border-white/[0.06]" />

              {/* Font family */}
              <div className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className={labelClass}>Font family</p>
                  <p className={descriptionClass}>Choose your coding font</p>
                </div>

                <select
                  value={settings.fontFamily}
                  onChange={(e) => updateSetting("fontFamily", e.target.value)}
                  className={selectClass}
                >
                  <option value="Consolas">Consolas</option>
                  <option value="Fira Code">Fira Code</option>
                  <option value="JetBrains Mono">JetBrains Mono</option>
                  <option value="Cascadia Code">Cascadia Code</option>
                  <option value="Courier New">Courier New</option>
                </select>
              </div>

              <div className="border-t border-white/[0.06]" />

              {/* Tab size */}
              <div className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className={labelClass}>Tab size</p>
                  <p className={descriptionClass}>
                    Spaces per indentation level
                  </p>
                </div>

                <select
                  value={settings.tabSize}
                  onChange={(e) =>
                    updateSetting("tabSize", Number(e.target.value))
                  }
                  className={selectClass}
                >
                  {[2, 4, 8].map((size) => (
                    <option key={size} value={size}>
                      {size} spaces
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Appearance */}
          <section>
            <h3 className={sectionTitle}>
              <Palette size={14} />
              Appearance
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {themes.map((theme) => {
                const selected = settings.theme === theme.id;

                return (
                  <button
                    key={theme.id}
                    onClick={() =>
                      updateSetting(
                        "theme",
                        theme.id as EditorSettings["theme"],
                      )
                    }
                    className={`group relative overflow-hidden rounded-xl border p-2 text-left transition-all ${
                      selected
                        ? "border-blue-500/70 bg-blue-500/[0.07]"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <div
                      className="h-[76px] overflow-hidden rounded-lg border border-black/10 p-3"
                      style={{ backgroundColor: theme.background }}
                    >
                      <div
                        className="mb-2 font-mono text-[9px]"
                        style={{ color: theme.foreground }}
                      >
                        <span style={{ color: theme.accent }}>const</span>{" "}
                        editor = {"{"}
                      </div>
                      <div
                        className="font-mono text-[9px]"
                        style={{ color: theme.foreground }}
                      >
                        theme:{" "}
                        <span style={{ color: theme.accent }}>"dark"</span>
                      </div>
                      <div
                        className="mt-1 font-mono text-[9px]"
                        style={{ color: theme.foreground }}
                      >
                        {"}"}
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1 pb-1 pt-3">
                      <div>
                        <p className="text-xs font-medium text-gray-200">
                          {theme.name}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-500">
                          {theme.description}
                        </p>
                      </div>

                      {selected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                          <Check size={12} />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Editor behavior */}
          <section>
            <h3 className={sectionTitle}>
              <Code2 size={14} />
              Editor behavior
            </h3>

            <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.07] bg-white/[0.02] px-4">
              <div className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-start gap-3">
                  <AlignLeft size={16} className="mt-0.5 text-gray-500" />
                  <div>
                    <p className={labelClass}>Word wrap</p>
                    <p className={descriptionClass}>
                      Wrap long lines inside the editor
                    </p>
                  </div>
                </div>

                <Toggle
                  checked={settings.wordWrap}
                  onClick={() => updateSetting("wordWrap", !settings.wordWrap)}
                />
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-start gap-3">
                  <Sparkles size={16} className="mt-0.5 text-gray-500" />
                  <div>
                    <p className={labelClass}>Auto-completion</p>
                    <p className={descriptionClass}>
                      Show suggestions while typing
                    </p>
                  </div>
                </div>

                <Toggle
                  checked={!settings.disableAutocomplete}
                  onClick={() =>
                    updateSetting(
                      "disableAutocomplete",
                      !settings.disableAutocomplete,
                    )
                  }
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.07] bg-[#0d0f15] px-6 py-4">
          <button
            onClick={onReset}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 transition hover:bg-white/[0.05] hover:text-gray-200"
          >
            <RotateCcw size={13} />
            Reset defaults
          </button>

          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditorSettingsModal;
