import { useMemo } from "react";
import { useGraphSelectionStore, useGraphStore } from "@/store/graph/store.ts";

export const useGraph = () => useGraphStore((state) => state.graph);

export const useGraphMetadata = () => useGraphStore((state) => state.graph.metadata);

export const useRootList = () => useGraphStore((state) => state.graph.rootList);

export const useSelectedComponent = () => {
    const uid = useGraphSelectionStore((state) => state.selectedComponentUid);
    return useGraphStore((state) =>
        uid === null ? undefined : state.graph.componentsByUid.get(uid),
    );
};

export const useIsSelectedComponent = (uid?: number) =>
    useGraphSelectionStore((state) => uid !== undefined && state.selectedComponentUid === uid);

export const useComponentViews = () => useGraphStore((state) => state.graph.componentViews);

export const useRelationViews = () => useGraphStore((state) => state.graph.relationViews);

export const useComponentHistory = () => {
    const historyUids = useGraphSelectionStore((state) => state.componentHistoryUids);
    const componentsByUid = useGraphStore((state) => state.graph.componentsByUid);

    return useMemo(
        () =>
            historyUids.flatMap((uid) => {
                const component = componentsByUid.get(uid);
                return component === undefined ? [] : [component];
            }),
        [componentsByUid, historyUids],
    );
};

export const useSelectedRelation = () => {
    const uid = useGraphSelectionStore((state) => state.selectedRelationUid);
    return useGraphStore((state) => (uid === null ? undefined : state.graph.relations.get(uid)));
};

export const useFilename = () =>
    useGraphStore((state) => (state.filename !== null ? state.filename : undefined));

export const useStoredSystemDataFiles = () => useGraphStore((state) => state.systemDataFiles);

export const useGraphActions = () => useGraphStore((state) => state.actions);
