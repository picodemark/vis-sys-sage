import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { create } from "zustand/react";
import type { GraphTab } from "@/types/tab.ts";

interface SettingsState {
    graphTab: GraphTab;
    showImport: boolean;
}

interface SettingsActions {
    setGraphTab: (graphTab: GraphTab) => void;
    setShowImport: (importData: boolean) => void;
}

type SettingsStore = SettingsState & { actions: SettingsActions };
type PersistedSettingsState = SettingsState;

const SETTINGS_STORAGE_VERSION = 1;
const SETTINGS_STORAGE_NAME = `vis-sys-sage.settings.v${SETTINGS_STORAGE_VERSION}`;

const initialState: SettingsState = {
    graphTab: "componentTree",
    showImport: false,
};

function isPersistedSettingsState(value: unknown): value is PersistedSettingsState {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const state = value as Record<string, unknown>;
    return (
        (state.graphTab === "componentTree" || state.graphTab === "relationGraph") &&
        typeof state.showImport === "boolean"
    );
}

export const useSettingsStore = create<SettingsStore>()(
    devtools(
        persist(
            (set) => ({
                ...initialState,
                actions: {
                    setGraphTab: (graphTab: GraphTab) =>
                        set({ graphTab }, false, "settings/setGraphTab"),
                    setShowImport: (importData: boolean) =>
                        set({ showImport: importData }, false, "settings/setShowImport"),
                },
            }),
            {
                name: SETTINGS_STORAGE_NAME,
                storage: createJSONStorage(() => localStorage),
                partialize: (state): PersistedSettingsState => ({
                    graphTab: state.graphTab,
                    showImport: state.showImport,
                }),
                merge: (persistedState, currentState) =>
                    isPersistedSettingsState(persistedState)
                        ? { ...currentState, ...persistedState }
                        : currentState,
                version: SETTINGS_STORAGE_VERSION,
            },
        ),
        {
            name: "settings",
        },
    ),
);
