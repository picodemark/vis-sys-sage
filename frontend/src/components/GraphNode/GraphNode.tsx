import { memo } from "react";
import styles from "@/components/GraphNode/GraphNode.module.css";
import type { Component } from "@/types/component.ts";

interface GraphNodeProps {
    variant: "interactive" | "context";
    component: Component;
    x: number;
    y: number;
    color: string;
    code: string;
    labelPriority?: number;
    selected: boolean;
    showLabel: boolean;
}

export function getGraphNodeUid(target: EventTarget) {
    if (!(target instanceof SVGCircleElement)) {
        return undefined;
    }

    const uid = target.dataset.componentUid;
    return uid === undefined ? undefined : Number(uid);
}

export const GraphNode = memo(function GraphNode({
    variant,
    component,
    x,
    y,
    color,
    code,
    labelPriority,
    selected,
    showLabel,
}: GraphNodeProps) {
    const interactive = variant === "interactive";
    const root = component.parentUid === null;
    const resolvedLabelPriority = labelPriority ?? (selected ? 2 : root ? 1 : 0);

    return (
        <g
            data-testid={`graph-node-${component.uid}`}
            className={styles.node}
            transform={`translate(${x},${y})`}
            data-interactive={interactive}
            data-root={root || undefined}
            data-selected={selected || undefined}
        >
            <circle
                className={styles.hitTarget}
                data-component-uid={interactive ? component.uid : undefined}
            />
            <circle
                className={styles.circle}
                pointerEvents="none"
                fill={color}
                stroke={
                    selected ? "var(--mantine-primary-color-filled)" : "var(--mantine-color-body)"
                }
            />
            {showLabel && (
                <text
                    className={styles.label}
                    data-graph-label=""
                    data-graph-label-priority={resolvedLabelPriority}
                    x={root ? 14 : 10}
                    y={0}
                    dominantBaseline="middle"
                >
                    {`${code} ${component.id}`}
                </text>
            )}
        </g>
    );
});
