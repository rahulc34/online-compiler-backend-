import { useState } from "react";
import type { EditorTab } from "../types/editor.types";

import { DEFAULT_LANGUAGE, LANGUAGES } from "../../monaco/constants/languages";

const defaultLanguage = LANGUAGES.find(
  (language) => language.id === DEFAULT_LANGUAGE,
)!;

const createTab = (id: number): EditorTab => ({
  id: String(id),
  name: `Code ${id}`,
  code: defaultLanguage.defaultCode,
  language: DEFAULT_LANGUAGE,
});

export function useEditorTabs() {
  const [tabs, setTabs] = useState<EditorTab[]>([createTab(1)]);

  const [activeTabId, setActiveTabId] = useState("1");
  const [nextTabId, setNextTabId] = useState(2);

  const activeTab = tabs.find((tab) => tab.id === activeTabId)!;

  const addTab = () => {
    const newTab = createTab(nextTabId);

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setNextTabId((prev) => prev + 1);
  };

  const closeTab = (tabId: string) => {
    // Prevent closing the last remaining tab.
    if (tabs.length === 1) return;

    const closingIndex = tabs.findIndex((tab) => tab.id === tabId);

    if (closingIndex === -1) return;

    const remainingTabs = tabs.filter((tab) => tab.id !== tabId);

    // If the active tab is being closed,
    // select the next tab or the previous one.
    if (activeTabId === tabId) {
      const nextActiveTab =
        remainingTabs[closingIndex] ?? remainingTabs[closingIndex - 1];

      setActiveTabId(nextActiveTab.id);
    }

    setTabs(remainingTabs);
  };

  const updateActiveTab = (updates: Partial<EditorTab>) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId ? { ...tab, ...updates } : tab,
      ),
    );
  };

  return {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    addTab,
    closeTab,
    updateActiveTab,
  };
}
