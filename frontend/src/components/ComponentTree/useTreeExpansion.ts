import { useEffect, useMemo, useState } from "react";
import type { Component } from "@/types/component.ts";
import { getChildren, getSelectionExpansion } from "./layout.ts";

const INITIAL_EXPANSION_DEPTH = 2;

interface ExpansionState {
    rootUid: number;
    expanded: Set<number>;
}

export function useTreeExpansion(
    root: Component,
    selectedComponent: Component,
    components: Map<number, Component>,
) {
    const requiredExpansion = useMemo(
        () => getSelectionExpansion(selectedComponent, components, INITIAL_EXPANSION_DEPTH),
        [components, selectedComponent],
    );
    const [state, setState] = useState<ExpansionState>(() => ({
        rootUid: root.uid,
        expanded: requiredExpansion,
    }));
    const expanded = state.rootUid === root.uid ? state.expanded : requiredExpansion;
    const expandableUids = useMemo(
        () =>
            new Set(
                [...components.values()]
                    .filter((component) => (component.children?.length ?? 0) > 0)
                    .map((component) => component.uid),
            ),
        [components],
    );

    useEffect(() => {
        setState((previous) => {
            const previousExpanded =
                previous.rootUid === root.uid ? previous.expanded : new Set<number>();
            const nextExpanded = new Set([...previousExpanded, ...requiredExpansion]);
            const unchanged =
                previous.rootUid === root.uid &&
                previousExpanded.size === nextExpanded.size &&
                [...previousExpanded].every((uid) => nextExpanded.has(uid));

            return unchanged ? previous : { rootUid: root.uid, expanded: nextExpanded };
        });
    }, [requiredExpansion, root.uid]);

    function toggle(component: Component) {
        if (getChildren(component, components).length === 0) {
            return;
        }

        setState((previous) => {
            const current = previous.rootUid === root.uid ? previous.expanded : expanded;
            const next = new Set(current);
            if (next.has(component.uid)) {
                next.delete(component.uid);
            } else {
                next.add(component.uid);
            }
            return { rootUid: root.uid, expanded: next };
        });
    }

    function expandAll() {
        setState({ rootUid: root.uid, expanded: new Set(expandableUids) });
    }

    function collapseToRootChildren() {
        setState({
            rootUid: root.uid,
            expanded: (root.children?.length ?? 0) > 0 ? new Set([root.uid]) : new Set(),
        });
    }

    const allExpanded =
        expanded.size === expandableUids.size &&
        [...expandableUids].every((uid) => expanded.has(uid));
    const rootChildrenVisible =
        expanded.size === ((root.children?.length ?? 0) > 0 ? 1 : 0) &&
        ((root.children?.length ?? 0) === 0 || expanded.has(root.uid));

    return {
        allExpanded,
        collapseToRootChildren,
        expandAll,
        expanded,
        rootChildrenVisible,
        toggle,
    };
}
