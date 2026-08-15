import { Stack, Text } from "@mantine/core";
import { DepthRingSymbol } from "@/components/GraphLegend/DepthRingSymbol.tsx";
import { LegendFrame } from "@/components/GraphLegend/LegendFrame.tsx";
import { LegendItem } from "@/components/GraphLegend/LegendItem.tsx";
import { LineSymbol } from "@/components/GraphLegend/LineSymbol.tsx";
import { NodeSymbol } from "@/components/GraphLegend/NodeSymbol.tsx";
import { TypeList } from "@/components/GraphLegend/TypeList.tsx";
import type { GraphLegendType } from "@/components/GraphLegend/types.ts";

interface ComponentTreeLegendProps {
    componentTypes: GraphLegendType[];
    variant: "expandable" | "selection-only";
}

export function ComponentTreeLegend({ componentTypes, variant }: ComponentTreeLegendProps) {
    return (
        <LegendFrame
            graphType="Radial tree"
            testIdPrefix="component-tree"
            description="A component hierarchy with one circular ring for every depth level."
        >
            <Stack gap={5}>
                <LegendItem
                    symbol={<NodeSymbol variant="component" />}
                    label="Component node. Color identifies its type"
                />
                <LegendItem
                    symbol={<NodeSymbol variant="root" />}
                    label="Larger node marks the tree root"
                />
                <LegendItem
                    symbol={<DepthRingSymbol />}
                    label="Depth ring. Nodes on it share the same level"
                />
                <LegendItem
                    symbol={<LineSymbol variant="hierarchy" />}
                    label="Parent-child hierarchy link"
                />
                <LegendItem
                    symbol={<LineSymbol variant="highlighted" />}
                    label="Highlighted path leads to the selection"
                />
            </Stack>
            <TypeList
                title="COMPONENT TYPES"
                types={componentTypes}
            />
            <Text
                size="xs"
                c="dimmed"
            >
                {variant === "expandable"
                    ? "Click a node to select it. Double-click to expand or fold its children."
                    : "Click a node to select it."}
            </Text>
        </LegendFrame>
    );
}
