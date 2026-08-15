import { IconArrowsMaximize, IconArrowsMinimize } from "@tabler/icons-react";
import { useMemo } from "react";
import { GraphCanvas } from "@/components/GraphCanvas/GraphCanvas.tsx";
import { ComponentTreeLegend } from "@/components/GraphLegend/ComponentTreeLegend.tsx";
import type { GraphLegendType } from "@/components/GraphLegend/types.ts";
import { useComponentViews } from "@/store/graph/selectors.ts";
import type { Component } from "@/types/component.ts";
import { ComponentTreeLinks } from "./ComponentTreeLinks.tsx";
import { ComponentTreeNodes } from "./ComponentTreeNodes.tsx";
import { computeTreeLayout, createTreeRendering } from "./layout.ts";
import { useTreeExpansion } from "./useTreeExpansion.ts";

const DENSE_GRAPH_SIZE = 250;
const OVERVIEW_RENDERING_SIZE = 1_000;
const DEFAULT_LABEL_ZOOM = 0.6;
const DENSE_LABEL_ZOOM = 2;

interface ComponentTreeProps {
    variant: "expandable" | "selection-only";
    root: Component;
    selectedComponent: Component;
    components: Map<number, Component>;
    onSelect: (component: Component) => void;
}

export function ComponentTree({
    variant,
    root,
    selectedComponent,
    components,
    onSelect,
}: ComponentTreeProps) {
    const expandable = variant === "expandable";
    const componentViews = useComponentViews();
    const expansion = useTreeExpansion(root, selectedComponent, components);
    const layout = useMemo(
        () => computeTreeLayout(root, selectedComponent.uid, expansion.expanded, components),
        [components, expansion.expanded, root, selectedComponent.uid],
    );
    const rendering = useMemo(
        () => createTreeRendering(layout, componentViews),
        [componentViews, layout],
    );
    const componentTypes = useMemo(
        () =>
            [...new Set(layout.nodes.map(({ component }) => component.type))]
                .sort((left, right) => left.localeCompare(right))
                .map<GraphLegendType>((type) => ({
                    label: type,
                    code: componentViews[type].code,
                    color: componentViews[type].color,
                })),
        [componentViews, layout.nodes],
    );
    const overviewRendering = layout.nodes.length >= OVERVIEW_RENDERING_SIZE;

    return (
        <GraphCanvas
            testId="component-tree-graph"
            title="Component Tree"
            bounds={layout.bounds}
            labelZoomThreshold={
                layout.nodes.length > DENSE_GRAPH_SIZE ? DENSE_LABEL_ZOOM : DEFAULT_LABEL_ZOOM
            }
            legend={
                <ComponentTreeLegend
                    componentTypes={componentTypes}
                    variant={variant}
                />
            }
            controls={
                expandable
                    ? [
                          {
                              label: "Expand all",
                              icon: <IconArrowsMaximize size={16} />,
                              disabled: expansion.allExpanded,
                              onClick: expansion.expandAll,
                          },
                          {
                              label: "Collapse to one level below root",
                              icon: <IconArrowsMinimize size={16} />,
                              disabled: expansion.rootChildrenVisible,
                              onClick: expansion.collapseToRootChildren,
                          },
                      ]
                    : []
            }
        >
            {(showLabels) => (
                <>
                    <ComponentTreeLinks
                        layout={layout}
                        overviewRendering={overviewRendering}
                        rendering={rendering}
                    />
                    <ComponentTreeNodes
                        variant={variant}
                        components={components}
                        componentViews={componentViews}
                        layout={layout}
                        onSelect={onSelect}
                        onToggle={expansion.toggle}
                        overviewRendering={overviewRendering}
                        rendering={rendering}
                        root={root}
                        selectedComponent={selectedComponent}
                        showLabels={showLabels}
                    />
                </>
            )}
        </GraphCanvas>
    );
}
