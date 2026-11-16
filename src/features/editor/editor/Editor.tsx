import { useEffect, useRef, useState } from "react";
import type { OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditorTypes } from "monaco-editor";

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
} from "lucide-react";

import { Group, Panel, Separator } from "react-resizable-panels";

import MonacoEditor from "../monaco/components/MonacoEditor";
import EditorSettingsModal from "../monaco/components/EditorSettingsModal";
import ExecutionPanel from "../shared/components/ExecutionPanel";
import type { ConsoleMessage } from "../console/components/ConsolePanel";

import { LANGUAGES } from "../monaco/constants/languages";
import { useEditorTabs } from "./hooks/useEditorTabs";

import { DEFAULT_EDITOR_SETTINGS } from "../monaco/types/editor-settings.types";

import type { EditorSettings } from "../monaco/types/editor-settings.types";

const SETTINGS_STORAGE_KEY = "compiler-editor-settings";

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
  const {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    addTab,
    closeTab,
    updateActiveTab,
  } = useEditorTabs();

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  // cosole
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const clearConsole = () => {
    setConsoleMessages([]);
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const addConsoleMessage = (type: ConsoleMessage["type"], text: string) => {
    setConsoleMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        text,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const testStreaming = async () => {
    setConsoleMessages([]);

    addConsoleMessage("system", "Compilation started...");
    await delay(1000);

    addConsoleMessage("system", "Compilation successful.");
    await delay(1000);

    addConsoleMessage("output", "Program started...");
    await delay(2000);

    addConsoleMessage("output", "Processing data...");
    await delay(2000);

    addConsoleMessage("output", "Almost done...");
    await delay(2000);

    addConsoleMessage("output", "Execution completed!");
    await delay(500);

    addConsoleMessage("system", "Program executed successfully.");
  };

  const testInteractiveInput = async () => {
    setConsoleMessages([]);

    addConsoleMessage("system", "Compilation started...");
    await delay(1000);

    addConsoleMessage("system", "Compilation successful.");
    await delay(500);

    addConsoleMessage("output", "Program started...");
    await delay(1000);

    addConsoleMessage("system", "Waiting for input...");
    addConsoleMessage("output", "Enter a number:");

    const input = window.prompt(
      "Program is waiting for input. Enter a number:",
    );

    if (input === null || input.trim() === "") {
      addConsoleMessage("error", "Input was cancelled or empty.");
      return;
    }

    addConsoleMessage("system", `Input received: ${input}`);
    await delay(1000);

    const number = Number(input);

    if (!Number.isFinite(number)) {
      addConsoleMessage("error", "Invalid integer input.");
      return;
    }

    addConsoleMessage("output", `You entered: ${number}`);
    addConsoleMessage("output", `Square: ${number * number}`);

    await delay(500);

    addConsoleMessage("system", "Program executed successfully.");
  };

  const testInputTimeout = async () => {
    setConsoleMessages([]);

    addConsoleMessage("system", "Compilation started...");
    await delay(1000);

    addConsoleMessage("system", "Compilation successful.");
    await delay(500);

    addConsoleMessage("output", "Waiting for your input...");
    addConsoleMessage("system", "Input required. Waiting for stdin...");

    await delay(8000);

    addConsoleMessage(
      "error",
      "Input timeout: No input received within 8 seconds.",
    );
    addConsoleMessage("system", "Execution terminated.");
  };

  const testConsole = () => {
    const scenario = Math.floor(Math.random() * 3);

    if (scenario === 0) {
      testStreaming();
    } else if (scenario === 1) {
      testInteractiveInput();
    } else {
      testInputTimeout();
    }
  };
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

    setOutput("");
  };

  // --------------------------------
  // FORMAT CODE
  // --------------------------------

  const handleFormatCode = async () => {
    try {
      const editor = editorRef.current;

      if (!editor) return;

      const formatAction = editor.getAction("editor.action.formatDocument");

      if (!formatAction) {
        console.warn("Formatter is not available.");
        return;
      }

      await formatAction.run();

      // Get the formatted code directly from Monaco
      const formattedCode = editor.getValue();
      console.log(formattedCode);
      // Update React state
      updateActiveTab({
        code: formattedCode,
      });
    } catch (error) {
      console.error("Unable to format code:", error);
    }
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

                      setOutput("");
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

                  <button onClick={handleFormatCode} title="Format code">
                    <Paintbrush
                      size={16}
                      className="text-gray-400 hover:text-white"
                    />
                  </button>

                  <button onClick={handleCopyCode} title="Copy code">
                    <Copy
                      size={16}
                      className="text-gray-400 hover:text-white"
                    />
                  </button>

                  <button
                    onClick={testConsole}
                    title="Code execution will be added later"
                    className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-[#3478f6] px-4 py-2 text-sm font-semibold text-white opacity-70"
                  >
                    <Play size={15} fill="currentColor" />
                    Run
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

                  <FolderOpen size={17} />
                  <Save size={16} />
                  <Share2 size={16} />
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
                output={output}
                consoleMessages={consoleMessages}
                onClearConsole={clearConsole}
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
