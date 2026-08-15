import * as d3 from "d3";
import type { GraphBounds } from "@/components/GraphCanvas/types.ts";
import type { Component } from "@/types/component.ts";
import type { View } from "@/types/view.ts";

const MIN_RADIUS = 160;
const LEVEL_GAP = 100;
const LEAF_GAP = 24;
const BOUNDS_PADDING = 12;

export interface PositionedNode {
    component: Component;
    x: number;
    y: number;
}

interface PositionedLink {
    key: string;
    path: string;
    selected: boolean;
}

export interface TreeLayout {
    bounds: GraphBounds;
    depthRadii: number[];
    links: PositionedLink[];
    nodes: PositionedNode[];
}

interface OverviewPath {
    color: string;
    path: string;
}

export interface TreeRendering {
    nodeByUid: Map<number, PositionedNode>;
    overviewPaths: OverviewPath[];
    regularLinkPath: string;
    selectedLinkPath: string;
}

export function getChildren(component: Component, components: Map<number, Component>) {
    return (component.children ?? []).flatMap((uid) => {
        const child = components.get(uid);
        return child === undefined ? [] : [child];
    });
}

export function getSelectionExpansion(
    selected: Component,
    components: Map<number, Component>,
    maxDepth: number,
) {
    const expanded = new Set<number>();
    const visited = new Set<number>();

    let ancestor = selected;
    while (ancestor.parentUid !== null && !visited.has(ancestor.uid)) {
        visited.add(ancestor.uid);
        expanded.add(ancestor.parentUid);

        const parent = components.get(ancestor.parentUid);
        if (parent === undefined) {
            break;
        }
        ancestor = parent;
    }

    function expandDescendants(component: Component, depth: number) {
        if (depth >= maxDepth || visited.has(component.uid)) {
            return;
        }

        visited.add(component.uid);
        const children = getChildren(component, components);
        if (children.length === 0) {
            return;
        }

        expanded.add(component.uid);
        for (const child of children) {
            expandDescendants(child, depth + 1);
        }
    }

    visited.clear();
    expandDescendants(selected, 0);

    return expanded;
}

function computeBounds(nodes: PositionedNode[], outerRadius: number): GraphBounds {
    const xValues = nodes.map((node) => node.x);
    const yValues = nodes.map((node) => node.y);
    const minX = Math.min(...xValues, -outerRadius) - BOUNDS_PADDING;
    const maxX = Math.max(...xValues, outerRadius) + BOUNDS_PADDING;
    const minY = Math.min(...yValues, -outerRadius) - BOUNDS_PADDING;
    const maxY = Math.max(...yValues, outerRadius) + BOUNDS_PADDING;

    return {
        x: minX,
        y: minY,
        width: Math.max(maxX - minX, 1),
        height: Math.max(maxY - minY, 1),
    };
}

export function computeTreeLayout(
    root: Component,
    selectedUid: number,
    expanded: Set<number>,
    components: Map<number, Component>,
): TreeLayout {
    const hierarchy = d3.hierarchy(root, (component) =>
        expanded.has(component.uid) ? getChildren(component, components) : [],
    );
    const radius = Math.max(
        MIN_RADIUS,
        hierarchy.height * LEVEL_GAP,
        (hierarchy.leaves().length * LEAF_GAP) / (2 * Math.PI),
    );
    const positioned = d3
        .tree<Component>()
        .size([2 * Math.PI, radius])
        .separation((a, b) => (a.parent === b.parent ? 1 : 1.5))(hierarchy);
    const selectedNode = positioned.descendants().find((node) => node.data.uid === selectedUid);
    const selectedPath = new Set(selectedNode?.ancestors().map((node) => node.data.uid) ?? []);
    const radialLink = d3
        .linkRadial<
            { source: { x: number; y: number }; target: { x: number; y: number } },
            { x: number; y: number }
        >()
        .angle((node) => node.x)
        .radius((node) => node.y);

    const nodes = positioned.descendants().map((node) => {
        const [x, y] = d3.pointRadial(node.x, node.y);
        return { component: node.data, x, y };
    });
    const depthRadii = [...new Set(positioned.descendants().map((node) => node.y))]
        .filter((depthRadius) => depthRadius > 0)
        .sort((a, b) => a - b);
    const links = positioned.links().map((link) => ({
        key: `${link.source.data.uid}-${link.target.data.uid}`,
        path: radialLink(link) ?? "",
        selected: selectedPath.has(link.target.data.uid),
    }));

    return {
        nodes,
        links,
        depthRadii,
        bounds: computeBounds(nodes, depthRadii.at(-1) ?? 0),
    };
}

export function createTreeRendering(layout: TreeLayout, componentViews: Record<string, View>) {
    const regularLinks: string[] = [];
    const selectedLinks: string[] = [];
    const pointsByColor = new Map<string, string[]>();
    const nodeByUid = new Map<number, PositionedNode>();

    for (const link of layout.links) {
        (link.selected ? selectedLinks : regularLinks).push(link.path);
    }

    for (const node of layout.nodes) {
        nodeByUid.set(node.component.uid, node);
        const color = componentViews[node.component.type].color;
        const points = pointsByColor.get(color) ?? [];
        points.push(`M${node.x},${node.y}h0.001`);
        pointsByColor.set(color, points);
    }

    return {
        nodeByUid,
        overviewPaths: [...pointsByColor].map(([color, points]) => ({
            color,
            path: points.join(""),
        })),
        regularLinkPath: regularLinks.join(""),
        selectedLinkPath: selectedLinks.join(""),
    } satisfies TreeRendering;
}
