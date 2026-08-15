import type { Component } from "@/types/component.ts";
import type { Graph, GraphData } from "@/types/graph.ts";
import { getNextCode } from "@/util/code.ts";
import { calculateGraphMetadata } from "@/util/meta.ts";
import { groupRelationsForDisplay } from "@/util/relation.ts";

function createSelfRelationPairIndex(relationList: Graph["relationList"]) {
    const pairs = new Map<string, [string, string]>();

    for (const group of groupRelationsForDisplay(relationList)) {
        if (group.length === 2) {
            const pair: [string, string] = [group[0].uid, group[1].uid];
            pairs.set(group[0].uid, pair);
            pairs.set(group[1].uid, pair);
        }
    }

    return pairs;
}

export function finalizeGraph(graph: GraphData): Graph {
    const componentList = [...graph.components.values()].flatMap((tree) => [...tree.values()]);
    const componentsByUid = new Map(componentList.map((component) => [component.uid, component]));
    const rootList = graph.rootIds.flatMap((uid) => {
        const root = componentsByUid.get(uid);
        return root === undefined ? [] : [root];
    });
    const rootOrderByUid = new Map(rootList.map((root, index) => [root.uid, index]));
    const relationList = [...graph.relations.values()];

    for (const component of componentList) {
        component.searchIndex = `${component.type} ${component.id}`.toLowerCase();
    }
    for (const relation of relationList) {
        relation.searchIndex = `${relation.type} ${relation.id}`.toLowerCase();
    }

    const usedRelationCodes: string[] = [];
    const relationViews = Object.fromEntries(
        Object.entries(graph.relationViews).map(([type, view]) => {
            const code = getNextCode(type, usedRelationCodes, true);
            usedRelationCodes.push(code);
            return [type, { ...view, code }];
        }),
    );
    const topologyOverviewComponents = new Map<number, Component>();

    if (graph.topology !== undefined) {
        componentsByUid.set(graph.topology.uid, graph.topology);
        topologyOverviewComponents.set(graph.topology.uid, graph.topology);

        for (const root of rootList) {
            const { children: _children, ...rootWithoutChildren } = root;
            topologyOverviewComponents.set(root.uid, {
                ...rootWithoutChildren,
                parentUid: graph.topology.uid,
            });
        }
    }

    return {
        ...graph,
        relationViews,
        componentsByUid,
        componentList,
        rootList,
        rootOrderByUid,
        relationList,
        topologyOverviewComponents,
        selfRelationPairByUid: createSelfRelationPairIndex(relationList),
        metadata: calculateGraphMetadata({
            ...graph,
            componentsByUid,
            componentList,
            relationList,
        }),
    };
}
