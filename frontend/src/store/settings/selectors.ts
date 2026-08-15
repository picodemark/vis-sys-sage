import { useSettingsStore } from "@/store/settings/store.ts";

export const useGraphTab = () => useSettingsStore((state) => state.graphTab);

export const useShowImport = () => useSettingsStore((state) => state.showImport);

export const useSettingsActions = () => useSettingsStore((state) => state.actions);
