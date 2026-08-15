import type { Attributes } from "@/types/attributes.ts";

export interface Component {
    uid: number;
    id: number;
    type: string;
    rootUid: number;
    parentUid: number | null;
    children?: number[];
    relations: string[];
    attributes: Attributes;
    searchIndex: string;
}
