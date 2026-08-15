import type { Attributes } from "@/types/attributes.ts";

export interface Relation {
    uid: string;
    id: number;
    type: string;
    category: number;
    componentUids: number[];
    ownerUid?: number;
    ordered: boolean;
    attributes: Attributes;
    searchIndex: string;
}
