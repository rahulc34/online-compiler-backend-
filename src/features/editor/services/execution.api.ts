import { apiRequest } from "../../../services/api-client";

export type ExecutionLanguage =
  | "cpp"
  | "java"
  | "python"
  | "javascript"
  | "typescript";

export type ExecutionStatus =
  | "queued"
  | "running"
  | "cancelling"
  | "cancelled"
  | "success"
  | "compilation_error"
  | "runtime_error"
  | "timeout"
  | "internal_error";

export interface ExecutionFile {
  name: string;
  content: string;
}

export interface CreateExecutionInput {
  language: ExecutionLanguage;
  files: ExecutionFile[];
  stdin: string;
}

export interface CreatedExecution {
  executionId: string;
  status: ExecutionStatus;
  language: ExecutionLanguage;
  createdAt: string;
}

export interface ExecutionResult {
  executionId: string;
  language: ExecutionLanguage;
  status: ExecutionStatus;
  stdout: string;
  stderr: string;
  compilationTime?: number;
  executionTime?: number;
  memoryUsed?: number;
  exitCode?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CancelExecutionResult {
  executionId: string;
  status: "cancelled" | "cancelling";
}

export const ENTRY_FILENAMES: Record<ExecutionLanguage, string> = {
  cpp: "main.cpp",
  java: "Main.java",
  python: "main.py",
  javascript: "main.js",
  typescript: "main.ts",
};

export function isExecutionLanguage(
  language: string,
): language is ExecutionLanguage {
  return Object.prototype.hasOwnProperty.call(ENTRY_FILENAMES, language);
}

export function createExecution(input: CreateExecutionInput) {
  return apiRequest<CreatedExecution>("/executions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getExecution(executionId: string, signal?: AbortSignal) {
  return apiRequest<ExecutionResult>(`/executions/${executionId}`, { signal });
}

export function cancelExecution(executionId: string) {
  return apiRequest<CancelExecutionResult>(
    `/executions/${executionId}/cancel`,
    { method: "POST" },
  );
}
