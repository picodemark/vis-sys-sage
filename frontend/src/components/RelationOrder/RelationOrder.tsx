import { Group, Text, Tooltip } from "@mantine/core";
import { IconListNumbers } from "@tabler/icons-react";

interface RelationOrderProps {
    position: number;
}

export function RelationOrder({ position }: RelationOrderProps) {
    return (
        <Tooltip label={`Position ${position} in ordered relation`}>
            <Group
                gap={3}
                wrap="nowrap"
                c="dimmed"
            >
                <IconListNumbers
                    size={15}
                    aria-hidden
                />
                <Text
                    size="xs"
                    ff="monospace"
                    fw={600}
                >
                    {position}
                </Text>
            </Group>
        </Tooltip>
    );
}
