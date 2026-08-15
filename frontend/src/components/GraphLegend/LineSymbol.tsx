interface LineSymbolProps {
    variant: "hierarchy" | "relation" | "highlighted";
}

export function LineSymbol({ variant }: LineSymbolProps) {
    const highlighted = variant === "highlighted";
    const color =
        variant === "hierarchy"
            ? "var(--mantine-color-dimmed)"
            : "var(--mantine-primary-color-filled)";

    return (
        <svg
            width="30"
            height="16"
            aria-hidden
        >
            <title>Graph line symbol</title>
            <path
                d="M2 12 C9 12 9 4 16 4 H28"
                fill="none"
                stroke={color}
                strokeLinecap="round"
                strokeWidth={highlighted ? 2.5 : 1.4}
            />
        </svg>
    );
}
