import type { Component } from "@/types/component.ts";
import type { Relation } from "@/types/relation.ts";
import type { Topology } from "@/types/topology.ts";
import type { View } from "@/types/view.ts";

type SubComponents = Map<number, Component>;

export interface GraphValueRange {
    average: number;
    min: number;
    max: number;
}

export interface GraphMetadata {
    componentCount: number;
    componentTreeCount: number;
    relationCount: number;
    hasTopology: boolean;
    relationsPerComponent: GraphValueRange;
    childrenPerComponent: GraphValueRange;
    maxTreeDepth: number;
    crossTreeRelationCount: number;
}

export interface GraphData {
    rootIds: number[];
    components: Map<number, SubComponents>;
    componentViews: Record<string, View>;
    relations: Map<string, Relation>;
    relationViews: Record<string, View>;
    topology?: Topology;
}

export interface Graph extends GraphData {
    componentsByUid: Map<number, Component>;
    componentList: Component[];
    rootList: Component[];
    rootOrderByUid: Map<number, number>;
    relationList: Relation[];
    topologyOverviewComponents: Map<number, Component>;
    selfRelationPairByUid: Map<string, [string, string]>;
    metadata: GraphMetadata;
}
