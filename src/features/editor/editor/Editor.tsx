import { useCallback, useEffect, useRef, useState } from "react";
import type { OnMount } from "@monaco-editor/react";
import type { ReactNode } from "react";
import type { editor as MonacoEditorTypes } from "monaco-editor";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Plus,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  ChevronDown,
  RefreshCw,
  Paintbrush,
  Copy,
  Play,
  Download,
  Save,
  FolderOpen,
  Share2,
  X,
  LoaderCircle,
} from "lucide-react";

import { Group, Panel, Separator } from "react-resizable-panels";

import MonacoEditor from "../monaco/components/MonacoEditor";
import EditorSettingsModal from "../monaco/components/EditorSettingsModal";
import ExecutionPanel from "../shared/components/ExecutionPanel";
import type { ExecutionPanelTab } from "../shared/components/ExecutionPanel";

import { LANGUAGES } from "../monaco/constants/languages";
import { useEditorTabs } from "./hooks/useEditorTabs";
import { useExecution } from "../hooks/useExecution";
import {
  ENTRY_FILENAMES,
  isExecutionLanguage,
} from "../services/execution.api";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  clearPendingEditorDraft,
  readPendingEditorDraft,
  savePendingEditorDraft,
} from "../services/editor-draft";

import { DEFAULT_EDITOR_SETTINGS } from "../monaco/types/editor-settings.types";

import type { EditorSettings } from "../monaco/types/editor-settings.types";

const SETTINGS_STORAGE_KEY = "compiler-editor-settings";

interface IconTooltipProps {
  label: string;
  focusable?: boolean;
  children: ReactNode;
}

function IconTooltip({
  label,
  focusable = false,
  children,
}: IconTooltipProps) {
  return (
    <span
      className="group relative inline-flex"
      tabIndex={focusable ? 0 : undefined}
      role={focusable ? "img" : undefined}
      aria-label={focusable ? label : undefined}
    >
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full right-0 z-50 mb-2 whitespace-nowrap rounded-md border border-[#3b3d48] bg-[#0d0e12] px-2 py-1 text-[11px] font-medium text-gray-200 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-has-[:focus-visible]:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

function loadEditorSettings(): EditorSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!saved) return DEFAULT_EDITOR_SETTINGS;

    return {
      ...DEFAULT_EDITOR_SETTINGS,
      ...JSON.parse(saved),
    };
  } catch {
    return DEFAULT_EDITOR_SETTINGS;
  }
}

function Editor() {
  const { user, isLoading: isAuthLoading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pendingEditorDraft] = useState(readPendingEditorDraft);
  const {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    addTab,
    closeTab,
    updateActiveTab,
  } = useEditorTabs(pendingEditorDraft, searchParams.get("language"));

  const [input, setInput] = useState(pendingEditorDraft?.stdin ?? "");
  const [activePanel, setActivePanel] = useState<ExecutionPanelTab>("io");
  const [authRedirectError, setAuthRedirectError] = useState<string | null>(
    null,
  );
  const editorDraftRef = useRef({
    code: activeTab.code,
    language: activeTab.language,
    stdin: input,
  });

  useEffect(() => {
    editorDraftRef.current = {
      code: activeTab.code,
      language: activeTab.language,
      stdin: input,
    };
  }, [activeTab.code, activeTab.language, input]);

  useEffect(() => {
    clearPendingEditorDraft();
  }, []);

  const handleAuthenticationRequired = useCallback(async () => {
    try {
      const currentUser = await refreshUser();

      if (currentUser) return;

      savePendingEditorDraft(editorDraftRef.current);
      navigate("/login", {
        state: {
          returnTo: "/editor",
          message:
            "Your session expired. Sign in to continue; your code and input were saved.",
        },
      });
    } catch (error) {
      setAuthRedirectError(
        error instanceof Error
          ? error.message
          : "Unable to verify your session. Please try again.",
      );
    }
  }, [navigate, refreshUser]);

  const {
    execution,
    submitExecution,
    cancelExecution,
    reportError,
    clearExecution,
  } = useExecution({
    onAuthenticationRequired: handleAuthenticationRequired,
  });

  const handleRun = async () => {
    setAuthRedirectError(null);

    if (activePanel !== "io" || isAuthLoading) return;

    if (!user) {
      try {
        savePendingEditorDraft(editorDraftRef.current);
        navigate("/login", {
          state: { returnTo: "/editor" },
        });
      } catch (error) {
        setAuthRedirectError(
          error instanceof Error
            ? error.message
            : "Unable to save your code before signing in.",
        );
      }

      return;
    }

    const language = activeTab.language;

    if (!isExecutionLanguage(language)) {
      reportError("The selected language is not supported for execution.");
      return;
    }

    await submitExecution({
      language,
      files: [
        {
          name: ENTRY_FILENAMES[language],
          content: activeTab.code,
        },
      ],
      stdin: input,
    });
  };

  const executionBusy =
    execution.status === "submitting" ||
    execution.status === "queued" ||
    execution.status === "running" ||
    execution.status === "cancelling";

  const executionForPanel = authRedirectError
    ? { ...execution, error: authRedirectError }
    : execution;

  // Editor settings
  const [settings, setSettings] = useState<EditorSettings>(loadEditorSettings);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Fullscreen
  const editorSectionRef = useRef<HTMLElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Monaco editor instance
  const editorRef = useRef<MonacoEditorTypes.IStandaloneCodeEditor | null>(
    null,
  );

  const currentLanguage = LANGUAGES.find(
    (language) => language.id === activeTab.language,
  )!;

  // --------------------------------
  // EDITOR SETTINGS
  // --------------------------------

  const handleSettingsChange = (nextSettings: EditorSettings) => {
    setSettings(nextSettings);

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings));
  };

  const handleResetSettings = () => {
    handleSettingsChange(DEFAULT_EDITOR_SETTINGS);
  };

  // --------------------------------
  // MONACO EDITOR INSTANCE
  // --------------------------------

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  // --------------------------------
  // RESET CODE
  // --------------------------------

  const handleResetCode = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset the current code?",
    );

    if (!confirmed) return;

    updateActiveTab({
      code: currentLanguage.defaultCode,
    });

    clearExecution();
  };

  // --------------------------------
  // COPY CODE
  // --------------------------------

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeTab.code);
    } catch (error) {
      console.error("Unable to copy code:", error);
    }
  };

  // --------------------------------
  // DOWNLOAD CODE
  // --------------------------------

  const handleDownloadCode = () => {
    const blob = new Blob([activeTab.code], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const fileName = activeTab.name.replace(/\.[^/.]+$/, "");

    link.href = url;
    link.download = `${fileName}.${currentLanguage.extension}`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  // --------------------------------
  // FULLSCREEN
  // --------------------------------

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await editorSectionRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Unable to toggle fullscreen:", error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === editorSectionRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <>
      <div className="h-screen w-full overflow-hidden bg-[#08090c] p-2 text-white">
        {/* MAIN RESIZABLE LAYOUT */}
        <Group orientation="horizontal" className="h-full w-full min-h-0">
          {/* LEFT: CODE EDITOR */}
          <Panel defaultSize={65} minSize={340}>
            <section
              ref={editorSectionRef}
              className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-[#292a30] bg-[#0d0e12]"
            >
              {/* Tab Bar */}
              <div className="flex h-10 shrink-0 items-center justify-between border-b border-[#1C1A1A] bg-[#141418]">
                <div className="flex h-full items-center gap-1 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`flex h-full items-center gap-2 border-b-2 px-3 ${
                        activeTabId === tab.id
                          ? "border-blue-500 bg-[#0d0e12] text-white"
                          : "border-transparent text-gray-400"
                      }`}
                    >
                      <button
                        onClick={() => setActiveTabId(tab.id)}
                        className="text-sm hover:text-white"
                      >
                        {tab.name}
                      </button>

                      <button
                        onClick={() => closeTab(tab.id)}
                        disabled={tabs.length === 1}
                        title="Close tab"
                        className={`rounded p-0.5 text-gray-500 hover:bg-[#292a30] hover:text-white ${
                          tabs.length === 1
                            ? "pointer-events-none cursor-not-allowed opacity-30"
                            : ""
                        }`}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex shrink-0 items-center gap-3 px-4 text-gray-400">
                  <button onClick={addTab} title="New tab">
                    <Plus size={17} className="hover:text-white" />
                  </button>

                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    title="Editor settings"
                  >
                    <SlidersHorizontal size={17} className="hover:text-white" />
                  </button>

                  <button
                    onClick={handleFullscreen}
                    title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? (
                      <Minimize2 size={15} className="hover:text-white" />
                    ) : (
                      <Maximize2 size={15} className="hover:text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Editor Toolbar */}
              <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-[#292a30] bg-[#141418] px-5">
                <div className="relative">
                  <select
                    value={activeTab.language}
                    onChange={(e) => {
                      const language = LANGUAGES.find(
                        (item) => item.id === e.target.value,
                      );

                      if (!language) return;

                      updateActiveTab({
                        language: language.id,
                        code: language.defaultCode,
                      });

                      clearExecution();
                    }}
                    className="cursor-pointer appearance-none rounded-lg bg-transparent py-2 pl-2 pr-8 text-sm font-medium text-gray-200 outline-none hover:bg-[#1c1d24]"
                  >
                    {LANGUAGES.map((language) => (
                      <option
                        key={language.id}
                        value={language.id}
                        className="bg-[#141418] text-white"
                      >
                        {language.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <button onClick={handleResetCode} title="Reset code">
                    <RefreshCw
                      size={16}
                      className="text-gray-400 hover:text-white"
                    />
                  </button>

                  <IconTooltip label="Format code - coming soon" focusable>
                    <Paintbrush
                      size={16}
                      aria-hidden="true"
                      className="text-gray-500"
                    />
                  </IconTooltip>

                  <button onClick={handleCopyCode} title="Copy code">
                    <Copy
                      size={16}
                      className="text-gray-400 hover:text-white"
                    />
                  </button>

                  <button
                    onClick={handleRun}
                    disabled={
                      isAuthLoading || activePanel !== "io" || executionBusy
                    }
                    aria-busy={executionBusy}
                    title={
                      activePanel === "io"
                        ? "Run code"
                        : "Switch to I/O to run code"
                    }
                    className="flex items-center gap-2 rounded-lg bg-[#3478f6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {executionBusy ? (
                      <>
                        <LoaderCircle
                          size={15}
                          aria-hidden="true"
                          className="animate-spin"
                        />
                        <span aria-live="polite">
                          {execution.status === "submitting"
                            ? "Submitting..."
                            : execution.status === "queued"
                              ? "Queued..."
                              : execution.status === "cancelling"
                                ? "Cancelling..."
                                : "Running..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <Play size={15} fill="currentColor" />
                        Run
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
                <MonacoEditor
                  value={activeTab.code}
                  onChange={(value) => updateActiveTab({ code: value })}
                  language={currentLanguage.monacoLanguage}
                  settings={settings}
                  onMount={handleEditorMount}
                />
              </div>

              {/* Status Bar */}
              <div className="flex h-[42px] shrink-0 items-center justify-between border-t border-[#292a30] bg-[#141418] px-5 text-xs text-gray-400">
                <div className="flex items-center gap-5">
                  <span>UTF-8</span>
                  <span>Spaces: {settings.tabSize}</span>
                  <span>{activeTab.code.split("\n").length} lines</span>
                </div>

                <div className="flex items-center gap-4">
                  <button onClick={handleDownloadCode} title="Download code">
                    <Download size={16} className="hover:text-white" />
                  </button>

                  <IconTooltip label="Workspace - coming soon" focusable>
                    <FolderOpen
                      size={17}
                      aria-hidden="true"
                      className="text-gray-500"
                    />
                  </IconTooltip>
                  <IconTooltip label="Save - coming soon" focusable>
                    <Save
                      size={16}
                      aria-hidden="true"
                      className="text-gray-500"
                    />
                  </IconTooltip>
                  <IconTooltip label="Share - coming soon" focusable>
                    <Share2
                      size={16}
                      aria-hidden="true"
                      className="text-gray-500"
                    />
                  </IconTooltip>
                </div>
              </div>
            </section>
          </Panel>

          {/* VERTICAL RESIZE HANDLE */}
          <Separator className="group flex w-2 shrink-0 cursor-col-resize items-center justify-center outline-none">
            <div className="h-12 w-[3px] rounded-full bg-[#363740] transition-colors group-hover:bg-blue-400 group-active:bg-blue-400" />
          </Separator>

          {/* RIGHT: INPUT AND OUTPUT */}
          <Panel defaultSize={35} minSize={320}>
            <section className="h-full min-h-0 min-w-0 overflow-hidden">
              <ExecutionPanel
                input={input}
                onInputChange={setInput}
                execution={executionForPanel}
                onCancel={cancelExecution}
                onActiveTabChange={setActivePanel}
              />
            </section>
          </Panel>
        </Group>
      </div>

      {/* EDITOR SETTINGS MODAL */}
      {isSettingsOpen && (
        <EditorSettingsModal
          settings={settings}
          onChange={handleSettingsChange}
          onClose={() => setIsSettingsOpen(false)}
          onReset={handleResetSettings}
        />
      )}
    </>
  );
}

export default Editor;
