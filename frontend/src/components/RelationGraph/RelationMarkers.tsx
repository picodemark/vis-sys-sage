interface RelationMarkersProps {
    arrowId: string;
    focusedArrowId: string;
}

export function RelationMarkers({ arrowId, focusedArrowId }: RelationMarkersProps) {
    return (
        <defs>
            <marker
                id={arrowId}
                viewBox="0 0 10 10"
                refX={9}
                refY={5}
                markerWidth={4.75}
                markerHeight={4.75}
                orient="auto-start-reverse"
            >
                <path
                    d="M 0.75 0.75 L 9.25 5 L 0.75 9.25 z"
                    fill="context-stroke"
                    fillOpacity={0.72}
                    stroke="var(--mantine-color-body)"
                    strokeOpacity={0.25}
                    strokeWidth={0.35}
                />
            </marker>
            <marker
                id={focusedArrowId}
                viewBox="0 0 10 10"
                refX={9}
                refY={5}
                markerWidth={6.25}
                markerHeight={6.25}
                orient="auto-start-reverse"
            >
                <path
                    d="M 0.75 0.75 L 9.25 5 L 0.75 9.25 z"
                    fill="context-stroke"
                    stroke="var(--mantine-color-body)"
                    strokeWidth={0.75}
                />
            </marker>
        </defs>
    );
}
