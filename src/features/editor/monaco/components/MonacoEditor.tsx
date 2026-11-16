import Editor from "@monaco-editor/react";
import type { OnMount, BeforeMount } from "@monaco-editor/react";
import type { EditorSettings } from "../types/editor-settings.types";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  settings: EditorSettings;
  onMount: OnMount;
}

function MonacoEditor({
  value,
  onChange,
  language = "cpp",
  settings,
  onMount,
}: MonacoEditorProps) {
  const handleBeforeMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme("github-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0d0e12",
        "editor.foreground": "#e6edf3",
        "editorLineNumber.foreground": "#6e7681",
        "editorLineNumber.activeForeground": "#e6edf3",
        "editor.selectionBackground": "#264f78",
      },
    });

    monaco.editor.defineTheme("monokai", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "75715E" },
        { token: "keyword", foreground: "F92672" },
        { token: "string", foreground: "E6DB74" },
        { token: "number", foreground: "AE81FF" },
      ],
      colors: {
        "editor.background": "#272822",
        "editor.foreground": "#F8F8F2",
      },
    });
  };

  const themeName = settings.theme === "light" ? "vs" : settings.theme;

  return (
    <div className="h-full w-full overflow-hidden">
      <Editor
        height="100%"
        width="100%"
        language={language}
        theme={themeName}
        value={value}
        beforeMount={handleBeforeMount}
        onMount={onMount}
        onChange={(value) => onChange(value ?? "")}
        options={{
          fontSize: settings.fontSize,
          fontFamily: settings.fontFamily,
          fontWeight: "400",
          lineHeight: 24,
          minimap: { enabled: false },
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: settings.tabSize,
          insertSpaces: true,
          wordWrap: settings.wordWrap ? "on" : "off",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          padding: { top: 12, bottom: 12 },
          bracketPairColorization: { enabled: true },
          guides: { indentation: true, bracketPairs: true },
          renderLineHighlight: "line",
          selectionHighlight: true,
          suggestOnTriggerCharacters: !settings.disableAutocomplete,
          quickSuggestions: !settings.disableAutocomplete,
          wordBasedSuggestions: settings.disableAutocomplete
            ? "off"
            : "currentDocument",
        }}
      />
    </div>
  );
}

export default MonacoEditor;
