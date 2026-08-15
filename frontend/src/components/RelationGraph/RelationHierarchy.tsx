import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { useState } from "react";
import { GraphNode, getGraphNodeUid } from "@/components/GraphNode/GraphNode.tsx";
import type { Component } from "@/types/component.ts";
import type { View } from "@/types/view.ts";
import { CORNER_RADIUS, HEADER_Y, type RelationGraphLayout } from "./layout.ts";
import styles from "./RelationGraph.module.css";

interface RelationHierarchyProps {
    componentViews: Record<string, View>;
    layout: RelationGraphLayout;
    onSelect: (component: Component) => void;
    selectedComponent: Component;
    showLabels: boolean;
}

export function RelationHierarchy({
    componentViews,
    layout,
    onSelect,
    selectedComponent,
    showLabels,
}: RelationHierarchyProps) {
    const [hoveredUid, setHoveredUid] = useState<number>();

    function handleClick(event: ReactMouseEvent<SVGGElement>) {
        const uid = getGraphNodeUid(event.target);
        if (uid === undefined || !layout.involved.has(uid)) {
            return;
        }

        const component = layout.rowByUid.get(uid)?.node.data;
        if (component !== undefined) {
            onSelect(component);
        }
    }

    function handlePointerOver(event: ReactPointerEvent<SVGGElement>) {
        const uid = getGraphNodeUid(event.target);
        setHoveredUid(uid !== undefined && layout.involved.has(uid) ? uid : undefined);
    }

    return (
        <>
            <g transform={`translate(0,${HEADER_Y})`}>
                <text
                    className={styles.annotation}
                    fontWeight={700}
                >
                    COMPONENTS
                </text>
            </g>
            <g transform={`translate(${layout.relationHeaderX},${HEADER_Y})`}>
                <text
                    className={styles.annotation}
                    fontWeight={700}
                    textAnchor="middle"
                >
                    RELATIONS
                </text>
            </g>

            <g
                fill="none"
                stroke="var(--mantine-color-default-border)"
                strokeWidth={1}
            >
                {layout.rows.slice(1).map((row) =>
                    row.parent === undefined ? null : (
                        <path
                            key={row.node.data.uid}
                            d={`M${row.parent.x},${row.parent.y}V${row.y - CORNER_RADIUS}Q${row.parent.x},${row.y} ${row.parent.x + CORNER_RADIUS},${row.y}H${row.x}`}
                            vectorEffect="non-scaling-stroke"
                        />
                    ),
                )}
            </g>

            <g
                stroke="var(--mantine-color-default-border)"
                strokeDasharray="2 5"
                strokeOpacity={0.55}
            >
                {layout.rows.map((row) =>
                    layout.involved.has(row.node.data.uid) ? (
                        <line
                            key={row.node.data.uid}
                            x1={row.x + 10}
                            x2={layout.relationX}
                            y1={row.y}
                            y2={row.y}
                            vectorEffect="non-scaling-stroke"
                        />
                    ) : null,
                )}
            </g>

            <g
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={() => setHoveredUid(undefined)}
            >
                {layout.rows.map(({ node, x, y }) => {
                    const component = node.data;
                    const view = componentViews[component.type];
                    const selected = component.uid === selectedComponent.uid;
                    const interactive = layout.involved.has(component.uid);

                    return (
                        <GraphNode
                            key={component.uid}
                            variant={interactive ? "interactive" : "context"}
                            component={component}
                            x={x}
                            y={y}
                            color={view.color}
                            code={view.code}
                            labelPriority={component.uid === hoveredUid ? 3 : undefined}
                            selected={selected}
                            showLabel={
                                showLabels ||
                                selected ||
                                (interactive && component.uid === hoveredUid)
                            }
                        />
                    );
                })}
            </g>
        </>
    );
}
