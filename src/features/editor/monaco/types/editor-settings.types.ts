export interface EditorSettings {
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  theme: "github-dark" | "light" | "monokai";
  wordWrap: boolean;
  disableAutocomplete: boolean;
}

export const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  fontSize: 14,
  fontFamily: "Consolas",
  tabSize: 4,
  theme: "github-dark",
  wordWrap: false,
  disableAutocomplete: false,
};
