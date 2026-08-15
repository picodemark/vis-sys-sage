interface NodeSymbolProps {
    variant: "component" | "root" | "muted";
}

export function NodeSymbol({ variant }: NodeSymbolProps) {
    const radius = variant === "root" ? 6 : 4;
    const muted = variant === "muted";

    return (
        <svg
            width="30"
            height="16"
            aria-hidden
        >
            <title>Component node symbol</title>
            <circle
                cx="15"
                cy="8"
                r={radius}
                fill={muted ? "var(--mantine-color-gray-4)" : "var(--mantine-primary-color-filled)"}
                opacity={muted ? 0.45 : 1}
                stroke="var(--mantine-color-body)"
                strokeWidth={1.5}
            />
        </svg>
    );
}
