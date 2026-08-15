import type { Graph, GraphMetadata, GraphValueRange } from "@/types/graph.ts";

type GraphMetadataSource = Pick<
    Graph,
    "rootIds" | "components" | "componentsByUid" | "componentList" | "relationList" | "topology"
>;

function getValueRange(values: number[]): GraphValueRange {
    if (values.length === 0) {
        return { average: 0, min: 0, max: 0 };
    }

    let sum = 0;
    let min = values[0];
    let max = values[0];

    for (const value of values) {
        sum += value;
        min = Math.min(min, value);
        max = Math.max(max, value);
    }

    return {
        average: sum / values.length,
        min,
        max,
    };
}

function getMaxComponentDepth(graph: GraphMetadataSource) {
    let maxDepth = 0;

    for (const rootUid of graph.rootIds) {
        const components = graph.components.get(rootUid);
        if (components === undefined) {
            continue;
        }

        const pending = [{ uid: rootUid, depth: 1 }];
        const visited = new Set<number>();

        while (pending.length > 0) {
            const current = pending.pop();
            if (current === undefined || visited.has(current.uid)) {
                continue;
            }

            visited.add(current.uid);
            maxDepth = Math.max(maxDepth, current.depth);

            const component = components.get(current.uid);
            for (const childUid of component?.children ?? []) {
                pending.push({ uid: childUid, depth: current.depth + 1 });
            }
        }
    }

    return maxDepth;
}

export function calculateGraphMetadata(graph: GraphMetadataSource): GraphMetadata {
    const components = graph.componentList;
    const hasTopology = graph.topology !== undefined;
    const topologyCount = hasTopology ? 1 : 0;
    const relationsPerComponent = components.map((component) => component.relations.length);
    const childrenPerComponent = components.map((component) => component.children?.length ?? 0);

    if (hasTopology) {
        relationsPerComponent.push(0);
        childrenPerComponent.push(graph.rootIds.length);
    }

    let crossTreeRelationCount = 0;
    for (const relation of graph.relationList) {
        const involvedRoots = new Set(
            relation.componentUids.flatMap((uid) => {
                const rootUid = graph.componentsByUid.get(uid)?.rootUid;
                return rootUid === undefined ? [] : [rootUid];
            }),
        );

        if (involvedRoots.size > 1) {
            crossTreeRelationCount += 1;
        }
    }

    const componentDepth = getMaxComponentDepth(graph);

    return {
        componentCount: components.length + topologyCount,
        componentTreeCount: graph.rootIds.length,
        relationCount: graph.relationList.length,
        hasTopology,
        relationsPerComponent: getValueRange(relationsPerComponent),
        childrenPerComponent: getValueRange(childrenPerComponent),
        maxTreeDepth: componentDepth + topologyCount,
        crossTreeRelationCount,
    };
}
