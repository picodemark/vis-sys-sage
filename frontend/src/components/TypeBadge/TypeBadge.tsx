import { Badge, Text } from "@mantine/core";
import { useGraphStore } from "@/store/graph/store.ts";
import type { ElementVariant } from "@/types/element.ts";

interface TypeBadgeProps {
    variant: ElementVariant;
    type: string;
}

export function TypeBadge({ variant, type }: TypeBadgeProps) {
    const view = useGraphStore((state) =>
        variant === "component"
            ? state.graph.componentViews[type]
            : state.graph.relationViews[type],
    );

    return (
        <Badge
            circle
            size="xl"
            color={view.color}
        >
            <Text
                size="sm"
                ff="monospace"
                fw={600}
            >
                {view.code}
            </Text>
        </Badge>
    );
}
