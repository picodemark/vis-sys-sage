import * as d3 from "d3";
import type { GraphBounds } from "@/components/GraphCanvas/types.ts";
import type { Component } from "@/types/component.ts";
import type { Relation } from "@/types/relation.ts";
import { groupRelationsForDisplay } from "@/util/relation.ts";

export const ROW_GAP = 36;
export const HEADER_Y = -30;
export const EMPTY_MESSAGE_Y = ROW_GAP / 2;
export const CORNER_RADIUS = 7;

const INDENT = 28;
const RELATION_GAP = 120;
const LANE_GAP = 24;
const MIN_RELATION_LANES = 3;
const ROOT_GAP = 12;
const SELF_LOOP_ENDPOINT_OFFSET = 6;
const PADDING = 18;

export interface Row {
    node: d3.HierarchyNode<Component>;
    x: number;
    y: number;
    parent?: Row;
}

export interface RelationSegment {
    key: string;
    path: string;
}

export interface RelationLine {
    key: string;
    relations: Relation[];
    rows: Row[];
    pointYs: number[];
    segments: RelationSegment[];
    selfReferencing: boolean;
    unary: boolean;
    unorderedHubY?: number;
}

export interface RelationGraphLayout {
    bounds: GraphBounds;
    involved: Set<number>;
    lines: RelationLine[];
    relationHeaderX: number;
    relationX: number;
    rowByUid: Map<number, Row>;
    rows: Row[];
}

interface PendingRelationSegment {
    fromY: number;
    key: string;
    laneX: number;
    reverseSelfSide: boolean;
    toY: number;
}

interface PendingRelationLine {
    key: string;
    relations: Relation[];
    rows: Row[];
    pointYs: number[];
    segments: PendingRelationSegment[];
    selfReferencing: boolean;
    unary: boolean;
    unorderedHubY?: number;
}

interface HierarchyRows {
    rowByUid: Map<number, Row>;
    rows: Row[];
}

function addAncestors(uid: number, relevant: Set<number>, componentByUid: Map<number, Component>) {
    for (let component = componentByUid.get(uid); component !== undefined; ) {
        if (relevant.has(component.uid)) {
            break;
        }

        relevant.add(component.uid);
        component =
            component.parentUid === null ? undefined : componentByUid.get(component.parentUid);
    }
}

function collectRelevantComponents(
    rootUid: number,
    selectedUid: number,
    relations: Relation[],
    componentByUid: Map<number, Component>,
) {
    const relevant = new Set<number>([rootUid]);
    addAncestors(selectedUid, relevant, componentByUid);

    for (const relation of relations) {
        for (const uid of relation.componentUids) {
            addAncestors(uid, relevant, componentByUid);
        }
    }

    return relevant;
}

function createHierarchyRows(
    root: Component,
    relevant: Set<number>,
    componentByUid: Map<number, Component>,
    rootOrderByUid: Map<number, number>,
): HierarchyRows {
    const rows: Row[] = [];
    const rowByUid = new Map<number, Row>();
    const relevantRootUids = new Set(
        [...relevant].flatMap((uid) => {
            const rootUid = componentByUid.get(uid)?.rootUid;
            return rootUid === undefined || rootUid === root.uid ? [] : [rootUid];
        }),
    );
    const roots = [
        root,
        ...[...relevantRootUids]
            .flatMap((uid) => {
                const component = componentByUid.get(uid);
                const order = rootOrderByUid.get(uid);
                return component === undefined || order === undefined ? [] : [{ component, order }];
            })
            .sort((left, right) => left.order - right.order)
            .map(({ component }) => component),
    ];

    roots.forEach((treeRoot, rootIndex) => {
        d3.hierarchy(treeRoot, (component) =>
            (component.children ?? []).flatMap((uid) => {
                const child = componentByUid.get(uid);
                return child !== undefined && relevant.has(uid) ? [child] : [];
            }),
        ).eachBefore((node) => {
            const row = {
                node,
                x: node.depth * INDENT,
                y: rows.length * ROW_GAP + rootIndex * ROOT_GAP,
                parent: node.parent === null ? undefined : rowByUid.get(node.parent.data.uid),
            };
            rows.push(row);
            rowByUid.set(node.data.uid, row);
        });
    });

    return { rowByUid, rows };
}

function createRelationLines(
    relations: Relation[],
    rowByUid: Map<number, Row>,
    relationX: number,
): PendingRelationLine[] {
    const lines: PendingRelationLine[] = [];

    for (const relationGroup of groupRelationsForDisplay(relations)) {
        const relation = relationGroup[0];
        const relationRows = relation.componentUids.flatMap((uid) => rowByUid.get(uid) ?? []);
        const unary = relation.componentUids.length === 1 && relationRows.length === 1;
        const selfReferencing =
            relation.componentUids.length >= 2 && new Set(relation.componentUids).size === 1;

        let unorderedHubY: number | undefined;
        let segments: PendingRelationSegment[] = [];

        if (unary) {
            segments = [
                {
                    fromY: relationRows[0].y,
                    toY: relationRows[0].y,
                    key: `${relation.uid}-0`,
                    laneX: relationX,
                    reverseSelfSide: false,
                },
            ];
        } else if (relationGroup.length === 2 && selfReferencing && relationRows.length > 0) {
            segments = relationGroup.map((record, side) => ({
                fromY: relationRows[0].y,
                toY: relationRows[0].y,
                key: `${record.uid}-0`,
                laneX: relationX,
                reverseSelfSide: side === 1,
            }));
        } else if (!relation.ordered && relationRows.length > 2) {
            let hubY = d3.mean(relationRows, (row) => row.y) ?? relationRows[0].y;
            if (relationRows.some((row) => Math.abs(row.y - hubY) < 1)) {
                hubY += ROW_GAP / 4;
            }
            unorderedHubY = hubY;
            segments = relationRows.map((row, index) => ({
                fromY: row.y,
                toY: hubY,
                key: `${relation.uid}-${index}`,
                laneX: relationX,
                reverseSelfSide: false,
            }));
        } else if (relationRows.length >= 2) {
            segments = d3.pairs(relationRows).map(([from, to], order) => ({
                fromY: from.y,
                toY: to.y,
                key: `${relation.uid}-${order}`,
                laneX: relationX,
                reverseSelfSide: false,
            }));
        }

        if (segments.length > 0) {
            lines.push({
                key: relationGroup.map(({ uid }) => uid).join(":"),
                relations: relationGroup,
                rows: relationRows,
                pointYs: [...new Set(relationRows.map((row) => row.y))],
                segments,
                selfReferencing,
                unary,
                unorderedHubY,
            });
        }
    }

    return lines;
}

function createRelationPath(
    relationX: number,
    laneX: number,
    fromY: number,
    toY: number,
    reverseSelfSide: boolean,
) {
    if (fromY === toY) {
        const direction = reverseSelfSide ? -1 : 1;
        return `M${relationX},${fromY - direction * SELF_LOOP_ENDPOINT_OFFSET}C${laneX},${fromY - direction * (ROW_GAP / 2)} ${laneX},${fromY + direction * (ROW_GAP / 2)} ${relationX},${toY + direction * SELF_LOOP_ENDPOINT_OFFSET}`;
    }

    return `M${relationX},${fromY}C${laneX},${fromY} ${laneX},${toY} ${relationX},${toY}`;
}

function routeRelationLines(pendingLines: PendingRelationLine[], relationX: number) {
    const routedSegments = pendingLines
        .flatMap((line) => line.segments)
        .sort((left, right) => {
            const leftStart = Math.min(left.fromY, left.toY);
            const leftEnd = Math.max(left.fromY, left.toY);
            const rightStart = Math.min(right.fromY, right.toY);
            const rightEnd = Math.max(right.fromY, right.toY);

            return (
                leftEnd - leftStart - (rightEnd - rightStart) ||
                leftStart - rightStart ||
                leftEnd - rightEnd ||
                left.key.localeCompare(right.key)
            );
        });
    routedSegments.forEach((segment, lane) => {
        segment.laneX = relationX + (lane + 1) * LANE_GAP;
    });

    const lines = pendingLines.map<RelationLine>(({ segments, ...line }) => ({
        ...line,
        segments: segments.map((segment) => ({
            key: segment.key,
            path: createRelationPath(
                relationX,
                segment.laneX,
                segment.fromY,
                segment.toY,
                segment.reverseSelfSide,
            ),
        })),
    }));

    return { lines, segmentCount: routedSegments.length };
}

export function createRelationGraphLayout(
    root: Component,
    selectedUid: number,
    componentsByUid: Map<number, Component>,
    rootOrderByUid: Map<number, number>,
    relations: Relation[],
): RelationGraphLayout {
    const relevant = collectRelevantComponents(root.uid, selectedUid, relations, componentsByUid);
    const { rowByUid, rows } = createHierarchyRows(root, relevant, componentsByUid, rootOrderByUid);
    const relationX = Math.max(...rows.map((row) => row.x), 0) + RELATION_GAP;
    const routed = routeRelationLines(
        createRelationLines(relations, rowByUid, relationX),
        relationX,
    );
    const involved = new Set(
        routed.lines.flatMap((line) => line.rows.map((row) => row.node.data.uid)),
    );
    const relationWidth = Math.max(routed.segmentCount, MIN_RELATION_LANES) * LANE_GAP;
    const relationHeaderX = relationX + relationWidth / 2;
    const maxY = Math.max(rows.at(-1)?.y ?? 0, routed.lines.length === 0 ? EMPTY_MESSAGE_Y : 0);

    return {
        rows,
        rowByUid,
        relationX,
        relationHeaderX,
        lines: routed.lines,
        involved,
        bounds: {
            x: -PADDING,
            y: HEADER_Y - PADDING,
            width: relationX + relationWidth + PADDING * 2,
            height: Math.max(maxY - HEADER_Y + PADDING * 2, PADDING * 2),
        },
    };
}
