import { Box, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import type { GraphLegendType } from "@/components/GraphLegend/types.ts";

interface TypeListProps {
    title: string;
    types: GraphLegendType[];
}

export function TypeList({ title, types }: TypeListProps) {
    if (types.length === 0) {
        return null;
    }

    return (
        <Stack gap={4}>
            <Text
                size="xs"
                fw={700}
                c="dimmed"
            >
                {title}
            </Text>
            <SimpleGrid
                cols={2}
                spacing={4}
                verticalSpacing={3}
            >
                {types.map((type) => (
                    <Group
                        key={type.label}
                        gap={5}
                        wrap="nowrap"
                        miw={0}
                    >
                        <Box
                            w={9}
                            h={9}
                            bg={type.color}
                            style={{ borderRadius: "50%", flex: "0 0 auto" }}
                        />
                        <Text
                            size="xs"
                            ff="monospace"
                            fw={700}
                        >
                            {type.code}
                        </Text>
                        <Text
                            size="xs"
                            truncate
                            title={type.label}
                        >
                            {type.label}
                        </Text>
                    </Group>
                ))}
            </SimpleGrid>
        </Stack>
    );
}
