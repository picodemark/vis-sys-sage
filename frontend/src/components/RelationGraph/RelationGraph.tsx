import { useId, useMemo } from "react";
import { GraphCanvas } from "@/components/GraphCanvas/GraphCanvas.tsx";
import { RelationGraphLegend } from "@/components/GraphLegend/RelationGraphLegend.tsx";
import type { GraphLegendType } from "@/components/GraphLegend/types.ts";
import { useComponentViews, useRelationViews } from "@/store/graph/selectors.ts";
import type { Component } from "@/types/component.ts";
import type { Relation } from "@/types/relation.ts";
import { createRelationGraphLayout } from "./layout.ts";
import { RelationHierarchy } from "./RelationHierarchy.tsx";
import { RelationLines } from "./RelationLines.tsx";
import { RelationMarkers } from "./RelationMarkers.tsx";

interface RelationGraphProps {
    root: Component;
    selectedComponent: Component;
    componentsByUid: Map<number, Component>;
    rootOrderByUid: Map<number, number>;
    relations: Relation[];
    onSelect: (component: Component) => void;
    onSelectRelation: (relationUid: string) => void;
}

export function RelationGraph({
    root,
    selectedComponent,
    componentsByUid,
    rootOrderByUid,
    relations,
    onSelect,
    onSelectRelation,
}: RelationGraphProps) {
    const componentViews = useComponentViews();
    const relationViews = useRelationViews();
    const arrowId = `relation-arrow-${useId().replaceAll(":", "")}`;
    const focusedArrowId = `${arrowId}-focused`;
    const layout = useMemo(
        () =>
            createRelationGraphLayout(
                root,
                selectedComponent.uid,
                componentsByUid,
                rootOrderByUid,
                relations,
            ),
        [componentsByUid, relations, root, rootOrderByUid, selectedComponent.uid],
    );
    const componentTypes = useMemo(
        () =>
            [...new Set(layout.rows.map(({ node }) => node.data.type))]
                .sort((left, right) => left.localeCompare(right))
                .map<GraphLegendType>((type) => ({
                    label: type,
                    code: componentViews[type].code,
                    color: componentViews[type].color,
                })),
        [componentViews, layout.rows],
    );
    const relationTypes = useMemo(
        () =>
            [
                ...new Set(
                    layout.lines.flatMap(({ relations: lineRelations }) =>
                        lineRelations.map(({ type }) => type),
                    ),
                ),
            ]
                .sort((left, right) => left.localeCompare(right))
                .map<GraphLegendType>((type) => ({
                    label: type,
                    code: relationViews[type].code,
                    color: relationViews[type].color,
                })),
        [layout.lines, relationViews],
    );

    return (
        <GraphCanvas
            testId="relation-graph"
            title="Relation Graph"
            bounds={layout.bounds}
            labelZoomThreshold={1}
            legend={
                <RelationGraphLegend
                    componentTypes={componentTypes}
                    relationTypes={relationTypes}
                />
            }
        >
            {(showLabels) => (
                <>
                    <RelationMarkers
                        arrowId={arrowId}
                        focusedArrowId={focusedArrowId}
                    />
                    <RelationHierarchy
                        componentViews={componentViews}
                        layout={layout}
                        onSelect={onSelect}
                        selectedComponent={selectedComponent}
                        showLabels={showLabels}
                    />
                    <RelationLines
                        arrowId={arrowId}
                        focusedArrowId={focusedArrowId}
                        layout={layout}
                        onSelect={onSelectRelation}
                        relationViews={relationViews}
                    />
                </>
            )}
        </GraphCanvas>
    );
}
