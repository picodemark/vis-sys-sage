export interface SysSageNode {
    address: number;
    id: number;
    type: string;
    children?: SysSageNode[];

    [key: string]: unknown;
}

export interface SysSageRelation {
    id: number;
    type: string;
    category: number;
    components: number[];
    owner?: number;
    ordered: boolean;

    [key: string]: unknown;
}

export interface SysSageGraph {
    componentTree: SysSageNode;
    relationGraph: SysSageRelation[];
}
