import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { create } from "zustand/react";
import { finalizeGraph } from "@/mapper/finalize.ts";
import type { Component } from "@/types/component.ts";
import type { Graph, GraphData } from "@/types/graph.ts";
import type { StoredSystemDataFiles } from "@/types/system.ts";

interface GraphState {
    graph: Graph;
    filename: string | null;
    systemDataFiles: StoredSystemDataFiles;
}

interface GraphSelectionState {
    selectedComponentUid: number | null;
    componentHistoryUids: number[];
    selectedRelationUid: string | null;
}

interface GraphActions {
    setGraph: (graph: Graph, filename: string, systemDataFiles?: StoredSystemDataFiles) => void;
    clearGraph: () => void;
    setSelectedComponent: (selected: Component) => void;
    setSelectedRelationUid: (selected: string) => void;
}

type GraphStore = GraphState & { actions: GraphActions };
type PersistedGraphState = {
    graph: GraphData;
    filename: string | null;
    systemDataFiles: StoredSystemDataFiles;
};

const MAX_COMPONENT_HISTORY_SIZE = 10;
const GRAPH_STORAGE_VERSION = 1;
const GRAPH_STORAGE_NAME = `vis-sys-sage.graph.v${GRAPH_STORAGE_VERSION}`;
const MAP_TYPE = "Map";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function mapReplacer(_key: string, value: unknown) {
    return value instanceof Map
        ? {
              type: MAP_TYPE,
              entries: [...value.entries()],
          }
        : value;
}

function mapReviver(_key: string, value: unknown) {
    if (isRecord(value) && value.type === MAP_TYPE && Array.isArray(value.entries)) {
        return new Map(value.entries as Iterable<readonly [unknown, unknown]>);
    }

    return value;
}

function isStoredSystemDataFiles(value: unknown): value is StoredSystemDataFiles {
    if (!isRecord(value)) {
        return false;
    }

    return Object.values(value).every(
        (file) =>
            isRecord(file) &&
            typeof file.name === "string" &&
            typeof file.mimeType === "string" &&
            typeof file.content === "string",
    );
}

function isPersistedGraphState(value: unknown): value is PersistedGraphState {
    if (!isRecord(value) || !isRecord(value.graph)) {
        return false;
    }

    return (
        Array.isArray(value.graph.rootIds) &&
        value.graph.components instanceof Map &&
        value.graph.relations instanceof Map &&
        isRecord(value.graph.componentViews) &&
        isRecord(value.graph.relationViews) &&
        (value.filename === null || typeof value.filename === "string") &&
        isStoredSystemDataFiles(value.systemDataFiles)
    );
}

function createInitialGraph() {
    return finalizeGraph({
        rootIds: [],
        components: new Map(),
        componentViews: {},
        relations: new Map(),
        relationViews: {},
    });
}

function getPersistedGraph(graph: Graph): GraphData {
    return {
        rootIds: graph.rootIds,
        components: graph.components,
        componentViews: graph.componentViews,
        relations: graph.relations,
        relationViews: graph.relationViews,
        ...(graph.topology === undefined ? {} : { topology: graph.topology }),
    };
}

function updateHistory(history: number[], selectedUid: number) {
    if (history.at(-1) === selectedUid) {
        return history;
    }

    return [...history.filter((uid) => uid !== selectedUid), selectedUid].slice(
        -MAX_COMPONENT_HISTORY_SIZE,
    );
}

export const useGraphSelectionStore = create<GraphSelectionState>()(
    devtools(
        () => ({
            selectedComponentUid: null,
            componentHistoryUids: [],
            selectedRelationUid: null,
        }),
        { name: "graph-selection" },
    ),
);

function resetSelection(graph: Graph) {
    const selectedComponentUid = graph.rootList[0]?.uid ?? null;
    useGraphSelectionStore.setState({
        selectedComponentUid,
        componentHistoryUids: selectedComponentUid === null ? [] : [selectedComponentUid],
        selectedRelationUid: null,
    });
}

function setSelectedComponent(selectedComponent: Component) {
    useGraphSelectionStore.setState((state) => ({
        selectedComponentUid: selectedComponent.uid,
        componentHistoryUids: updateHistory(state.componentHistoryUids, selectedComponent.uid),
        selectedRelationUid: null,
    }));
}

function setSelectedRelationUid(selectedRelationUid: string) {
    useGraphSelectionStore.setState({ selectedRelationUid });
}

const initialGraph = createInitialGraph();

export const useGraphStore = create<GraphStore>()(
    devtools(
        persist(
            (set) => ({
                graph: initialGraph,
                filename: null,
                systemDataFiles: {},
                actions: {
                    setGraph: (
                        graph: Graph,
                        filename: string,
                        systemDataFiles: StoredSystemDataFiles = {},
                    ) => {
                        set({ graph, filename, systemDataFiles }, false, "graph/setGraph");
                        resetSelection(graph);
                    },
                    clearGraph: () => {
                        const graph = createInitialGraph();
                        set(
                            { graph, filename: null, systemDataFiles: {} },
                            false,
                            "graph/clearGraph",
                        );
                        resetSelection(graph);
                    },
                    setSelectedComponent,
                    setSelectedRelationUid,
                },
            }),
            {
                name: GRAPH_STORAGE_NAME,
                storage: createJSONStorage(() => localStorage, {
                    replacer: mapReplacer,
                    reviver: mapReviver,
                }),
                partialize: (state): PersistedGraphState => ({
                    graph: getPersistedGraph(state.graph),
                    filename: state.filename,
                    systemDataFiles: state.systemDataFiles,
                }),
                merge: (persistedState, currentState) => {
                    if (!isPersistedGraphState(persistedState)) {
                        return currentState;
                    }

                    const graph = finalizeGraph(persistedState.graph);
                    resetSelection(graph);

                    return {
                        ...currentState,
                        graph,
                        filename: persistedState.filename,
                        systemDataFiles: persistedState.systemDataFiles,
                    };
                },
                version: GRAPH_STORAGE_VERSION,
            },
        ),
        { name: "graph" },
    ),
);
