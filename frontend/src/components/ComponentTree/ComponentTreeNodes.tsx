import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { useState } from "react";
import { GraphNode, getGraphNodeUid } from "@/components/GraphNode/GraphNode.tsx";
import type { Component } from "@/types/component.ts";
import type { View } from "@/types/view.ts";
import type { TreeLayout, TreeRendering } from "./layout.ts";

interface ComponentTreeNodesProps {
    variant: "expandable" | "selection-only";
    components: Map<number, Component>;
    componentViews: Record<string, View>;
    layout: TreeLayout;
    onSelect: (component: Component) => void;
    onToggle: (component: Component) => void;
    overviewRendering: boolean;
    rendering: TreeRendering;
    root: Component;
    selectedComponent: Component;
    showLabels: boolean;
}

export function ComponentTreeNodes({
    variant,
    components,
    componentViews,
    layout,
    onSelect,
    onToggle,
    overviewRendering,
    rendering,
    root,
    selectedComponent,
    showLabels,
}: ComponentTreeNodesProps) {
    const [hoveredUid, setHoveredUid] = useState<number>();
    const expandable = variant === "expandable";

    function getEventComponent(target: EventTarget) {
        const uid = getGraphNodeUid(target);
        return uid === undefined ? undefined : components.get(uid);
    }

    function handleClick(event: ReactMouseEvent<SVGGElement>) {
        const component = getEventComponent(event.target);
        if (component !== undefined) {
            onSelect(component);
        }
    }

    function handleDoubleClick(event: ReactMouseEvent<SVGGElement>) {
        const component = getEventComponent(event.target);
        if (component !== undefined) {
            onToggle(component);
        }
    }

    function handlePointerOver(event: ReactPointerEvent<SVGGElement>) {
        const uid = getGraphNodeUid(event.target);
        if (uid !== undefined) {
            setHoveredUid(uid);
        }
    }

    function handlePointerOut(event: ReactPointerEvent<SVGGElement>) {
        const uid = getGraphNodeUid(event.target);
        if (uid !== undefined) {
            setHoveredUid((previous) => (previous === uid ? undefined : previous));
        }
    }

    const highlightedUids = [root.uid, selectedComponent.uid, hoveredUid].filter(
        (uid, index, uids): uid is number => uid !== undefined && uids.indexOf(uid) === index,
    );
    const renderedNodes = overviewRendering
        ? highlightedUids.flatMap((uid) => rendering.nodeByUid.get(uid) ?? [])
        : layout.nodes;

    return (
        <g
            onClick={handleClick}
            onDoubleClick={expandable ? handleDoubleClick : undefined}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        >
            {overviewRendering &&
                showLabels &&
                layout.nodes.map(({ component, x, y }) => (
                    <circle
                        key={component.uid}
                        data-component-uid={component.uid}
                        cx={x}
                        cy={y}
                        r={10}
                        fill="transparent"
                        cursor="pointer"
                    />
                ))}
            {renderedNodes.map(({ component, x, y }) => {
                const view = componentViews[component.type];
                const selected = component.uid === selectedComponent.uid;

                return (
                    <GraphNode
                        key={component.uid}
                        variant={
                            variant === "selection-only" && component.uid === root.uid
                                ? "context"
                                : "interactive"
                        }
                        component={component}
                        x={x}
                        y={y}
                        color={view.color}
                        code={view.code}
                        labelPriority={component.uid === hoveredUid ? 3 : undefined}
                        selected={selected}
                        showLabel={
                            overviewRendering ||
                            showLabels ||
                            selected ||
                            component.uid === hoveredUid
                        }
                    />
                );
            })}
        </g>
    );
}
