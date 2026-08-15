import { Stack, Text } from "@mantine/core";
import { ArrowSymbol } from "@/components/GraphLegend/ArrowSymbol.tsx";
import { LegendFrame } from "@/components/GraphLegend/LegendFrame.tsx";
import { LegendItem } from "@/components/GraphLegend/LegendItem.tsx";
import { LineSymbol } from "@/components/GraphLegend/LineSymbol.tsx";
import { NodeSymbol } from "@/components/GraphLegend/NodeSymbol.tsx";
import { TypeList } from "@/components/GraphLegend/TypeList.tsx";
import type { GraphLegendType } from "@/components/GraphLegend/types.ts";

interface RelationGraphLegendProps {
    componentTypes: GraphLegendType[];
    relationTypes: GraphLegendType[];
}

export function RelationGraphLegend({ componentTypes, relationTypes }: RelationGraphLegendProps) {
    return (
        <LegendFrame
            graphType="Relation routing"
            testIdPrefix="relation-graph"
            description={
                "The selected Component, the other Components involved in its Relations, and " +
                "the tree branches needed for orientation. Unordered Relations involving more " +
                "than two Components meet at a diamond hub."
            }
        >
            <Stack gap={5}>
                <LegendItem
                    symbol={<NodeSymbol variant="component" />}
                    label="Component involved in a Relation. Click it to follow its Relations"
                />
                <LegendItem
                    symbol={<NodeSymbol variant="muted" />}
                    label="Ancestor node. It provides context and is not clickable"
                />
                <LegendItem
                    symbol={<LineSymbol variant="hierarchy" />}
                    label="Tree branch leading to an involved Component"
                />
                <LegendItem
                    symbol={<LineSymbol variant="relation" />}
                    label="Relation path. Color identifies its type"
                />
                <LegendItem
                    symbol={<ArrowSymbol />}
                    label={
                        "Arrows mark order between two or more Component entries. Paired " +
                        "self-relation records share one click target"
                    }
                />
                <LegendItem
                    symbol={<LineSymbol variant="highlighted" />}
                    label="Focused relation is bold. Other relations remain light"
                />
            </Stack>
            <TypeList
                title="COMPONENT TYPES"
                types={componentTypes}
            />
            <TypeList
                title="RELATION TYPES"
                types={relationTypes}
            />
            <Text
                size="xs"
                c="dimmed"
            >
                Click a relation path to inspect its data.
            </Text>
        </LegendFrame>
    );
}
