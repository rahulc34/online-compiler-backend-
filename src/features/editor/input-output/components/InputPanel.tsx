import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";

import {
  Upload,
  Copy,
  RefreshCw,
  FileText,
  Check,
  AlertCircle,
} from "lucide-react";

import type { InputPanelProps } from "../types/input.types";

const MAX_FILE_SIZE = 1024 * 1024;

const ALLOWED_EXTENSIONS = [".txt", ".in", ".input"];

function InputPanel({ value, onChange }: InputPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [feedback, setFeedback] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isError, setIsError] = useState(false);

  const showFeedback = (message: string, error = false) => {
    setFeedback(message);
    setIsError(error);
  };

  // Validate and import a file.
  const handleFileImport = async (file?: File) => {
    if (!file) return;

    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      showFeedback("Unsupported file format", true);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showFeedback("File size must be below 1 MB", true);
      return;
    }

    try {
      const content = await file.text();

      onChange(content);
      showFeedback(`${file.name} imported`);
    } catch {
      showFeedback("Unable to read file", true);
    }
  };

  // File picker.
  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    await handleFileImport(event.target.files?.[0]);

    event.target.value = "";
  };

  // Drag and drop.
  const handleDrop = async (event: DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    await handleFileImport(file);
  };

  const handleDragOver = (event: DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleCopy = async () => {
    if (!value) {
      showFeedback("Nothing to copy", true);
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      showFeedback("Input copied");
    } catch {
      showFeedback("Unable to copy input", true);
    }
  };

  const handleReset = () => {
    onChange("");
    showFeedback("Input cleared");
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-[#191a20] bg-[#141418]">
      {/* Header */}
      <div className="flex h-[50px] shrink-0 items-center justify-between border-b border-[#292a30] px-4">
        <div className="flex items-center gap-2">
          <FileText size={17} className="text-gray-400" />
          <h2 className="text-lg font-medium">Input</h2>
        </div>

        <div className="flex items-center gap-4 text-gray-400">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Import input"
            className="hover:text-white"
          >
            <Upload size={16} />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            title="Copy input"
            className="hover:text-white"
          >
            <Copy size={16} />
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="Reset input"
            className="hover:text-white"
          >
            <RefreshCw size={16} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.in,.input"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setFeedback("");
        }}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        placeholder="Enter your custom input here..."
        spellCheck={false}
        className={`min-h-0 flex-1 resize-none bg-transparent p-5 font-mono text-sm leading-6 text-gray-200 outline-none placeholder:text-gray-500 ${
          isDragging
            ? "border-2 border-dashed border-blue-500 bg-blue-500/5"
            : ""
        }`}
      />

      {/* Footer */}
      <div className="flex h-8 shrink-0 items-center justify-between border-t border-[#292a30] px-4 text-xs">
        <span className="text-gray-500">{value.length} characters</span>

        <span
          className={`flex items-center gap-1 ${
            isError ? "text-red-400" : "text-green-400"
          }`}
        >
          {feedback && (
            <>
              {isError ? <AlertCircle size={12} /> : <Check size={12} />}
              {feedback}
            </>
          )}
        </span>
      </div>
    </div>
  );
}

export default InputPanel;
