import type { KeyboardEvent } from "react";
import type { View } from "@/types/view.ts";
import type { RelationLine } from "./layout.ts";
import styles from "./RelationGraph.module.css";

interface RelationPathProps {
    arrowId: string;
    focusedArrowId: string;
    line: RelationLine;
    onSelect: (relationUid: string) => void;
    relationView: View;
    relationX: number;
    selectedRelationUid?: string;
    variant: "default" | "focused" | "dimmed";
}

function getRelationLabel(line: RelationLine) {
    const relation = line.relations[0];

    if (line.relations.length === 2) {
        return (
            `Two distinct self-referencing ${relation.type} records ` +
            `${line.relations[0].id} and ${line.relations[1].id}, shown on opposite visual sides`
        );
    }
    if (line.unary) {
        return `Unary ${relation.type} relation ${relation.id}`;
    }
    if (!relation.ordered && line.rows.length > 2) {
        return (
            `Unordered ${relation.type} Relation ${relation.id} involving ` +
            `${line.rows.length} Components without a defined order`
        );
    }
    return `${line.selfReferencing ? "Self-referencing " : ""}${relation.type} relation ${relation.id}`;
}

export function RelationPath({
    arrowId,
    focusedArrowId,
    line,
    onSelect,
    relationView,
    relationX,
    selectedRelationUid,
    variant,
}: RelationPathProps) {
    const focused = variant === "focused";
    const relation = line.relations[0];
    const selectedRecord = line.relations.find(({ uid }) => uid === selectedRelationUid);
    const selectedUid = selectedRecord?.uid ?? relation.uid;
    const label = getRelationLabel(line);

    function handleKeyDown(event: KeyboardEvent<SVGGElement>) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect(selectedUid);
        }
    }

    return (
        <g
            data-testid={`relation-path-${line.relations.map(({ uid }) => uid).join("-")}`}
            className={styles.relation}
            data-relation-id={line.relations.map(({ id }) => id).join(",")}
            data-selected={focused || undefined}
            data-dimmed={variant === "dimmed" || undefined}
            data-self-referencing={line.selfReferencing || undefined}
            data-self-records={
                line.selfReferencing ? (line.relations.length === 2 ? 2 : 1) : undefined
            }
            role="button"
            tabIndex={0}
            aria-label={label}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                color: relationView.color,
            }}
            onClick={() => onSelect(selectedUid)}
            onKeyDown={handleKeyDown}
        >
            <title>{label}</title>
            {line.pointYs.map((y) => (
                <circle
                    key={y}
                    className={styles.relationPoint}
                    cx={relationX}
                    cy={y}
                    fill="currentColor"
                    pointerEvents="none"
                />
            ))}
            {line.unorderedHubY !== undefined && (
                <rect
                    x={relationX - 4}
                    y={line.unorderedHubY - 4}
                    width={8}
                    height={8}
                    rx={1}
                    fill="currentColor"
                    pointerEvents="none"
                    transform={`rotate(45 ${relationX} ${line.unorderedHubY})`}
                />
            )}
            {line.segments.map((segment) => (
                <g key={segment.key}>
                    <path
                        className={styles.relationLine}
                        d={segment.path}
                        stroke="currentColor"
                        strokeWidth={2.2}
                        strokeDasharray={line.rows.length > 2 ? "7 5" : undefined}
                        markerEnd={
                            relation.ordered && !line.unary
                                ? `url(#${focused ? focusedArrowId : arrowId})`
                                : undefined
                        }
                        vectorEffect="non-scaling-stroke"
                        pointerEvents="none"
                    />
                    <path
                        className={styles.relationHitArea}
                        d={segment.path}
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                    />
                </g>
            ))}
        </g>
    );
}
