import type { Relation } from "@/types/relation.ts";

export type RelationDisplayGroup = [Relation] | [Relation, Relation];

export function isDirectionalSelfRelation(relation: Relation) {
    return (
        relation.ordered &&
        relation.componentUids.length === 2 &&
        relation.componentUids[0] === relation.componentUids[1]
    );
}

function getDirectionalSelfRelationKey(relation: Relation) {
    if (!isDirectionalSelfRelation(relation)) {
        return undefined;
    }

    return `${relation.componentUids[0]}:${relation.type}:${relation.category}`;
}

export function groupRelationsForDisplay(relations: Iterable<Relation>) {
    const groups: RelationDisplayGroup[] = [];
    const openGroupByKey = new Map<string, number>();

    for (const relation of relations) {
        const key = getDirectionalSelfRelationKey(relation);
        if (key === undefined) {
            groups.push([relation]);
            continue;
        }

        const openGroupIndex = openGroupByKey.get(key);
        if (openGroupIndex === undefined) {
            openGroupByKey.set(key, groups.length);
            groups.push([relation]);
            continue;
        }

        const openGroup = groups[openGroupIndex];
        groups[openGroupIndex] = [openGroup[0], relation];
        openGroupByKey.delete(key);
    }

    return groups;
}
