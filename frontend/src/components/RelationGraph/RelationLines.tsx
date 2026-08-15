import { useSelectedRelation } from "@/store/graph/selectors.ts";
import type { View } from "@/types/view.ts";
import { EMPTY_MESSAGE_Y, type RelationGraphLayout } from "./layout.ts";
import styles from "./RelationGraph.module.css";
import { RelationPath } from "./RelationPath.tsx";

interface RelationLinesProps {
    arrowId: string;
    focusedArrowId: string;
    layout: RelationGraphLayout;
    onSelect: (relationUid: string) => void;
    relationViews: Record<string, View>;
}

export function RelationLines({
    arrowId,
    focusedArrowId,
    layout,
    onSelect,
    relationViews,
}: RelationLinesProps) {
    const selectedRelationUid = useSelectedRelation()?.uid;
    const focusedLineKey = layout.lines.find(({ relations }) =>
        relations.some(({ uid }) => uid === selectedRelationUid),
    )?.key;
    const renderedLines =
        focusedLineKey === undefined
            ? layout.lines
            : [
                  ...layout.lines.filter(({ key }) => key !== focusedLineKey),
                  ...layout.lines.filter(({ key }) => key === focusedLineKey),
              ];

    return (
        <>
            {renderedLines.map((line) => (
                <RelationPath
                    key={line.key}
                    arrowId={arrowId}
                    focusedArrowId={focusedArrowId}
                    line={line}
                    onSelect={onSelect}
                    relationView={relationViews[line.relations[0].type]}
                    relationX={layout.relationX}
                    selectedRelationUid={selectedRelationUid}
                    variant={
                        focusedLineKey === undefined
                            ? "default"
                            : line.key === focusedLineKey
                              ? "focused"
                              : "dimmed"
                    }
                />
            ))}
            {layout.lines.length === 0 && (
                <g transform={`translate(${layout.relationHeaderX},${EMPTY_MESSAGE_Y})`}>
                    <text
                        className={styles.annotation}
                        dominantBaseline="middle"
                        textAnchor="middle"
                    >
                        No relations
                    </text>
                </g>
            )}
        </>
    );
}
