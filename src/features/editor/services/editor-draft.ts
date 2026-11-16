import { LANGUAGES } from "../monaco/constants/languages";

export interface PendingEditorDraft {
  code: string;
  language: string;
  stdin: string;
}

const PENDING_EDITOR_DRAFT_KEY = "compiler-pending-editor-draft";

export function readPendingEditorDraft(): PendingEditorDraft | null {
  const saved = sessionStorage.getItem(PENDING_EDITOR_DRAFT_KEY);

  if (!saved) return null;

  try {
    const draft: unknown = JSON.parse(saved);

    if (
      typeof draft === "object" &&
      draft !== null &&
      "code" in draft &&
      typeof draft.code === "string" &&
      "language" in draft &&
      typeof draft.language === "string" &&
      LANGUAGES.some((language) => language.id === draft.language) &&
      "stdin" in draft &&
      typeof draft.stdin === "string"
    ) {
      return {
        code: draft.code,
        language: draft.language,
        stdin: draft.stdin,
      };
    }
  } catch {
    sessionStorage.removeItem(PENDING_EDITOR_DRAFT_KEY);
    return null;
  }

  sessionStorage.removeItem(PENDING_EDITOR_DRAFT_KEY);
  return null;
}

export function savePendingEditorDraft(draft: PendingEditorDraft): void {
  sessionStorage.setItem(PENDING_EDITOR_DRAFT_KEY, JSON.stringify(draft));
}

export function clearPendingEditorDraft(): void {
  sessionStorage.removeItem(PENDING_EDITOR_DRAFT_KEY);
}
