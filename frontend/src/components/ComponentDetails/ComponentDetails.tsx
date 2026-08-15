import { Group, Stack, Text } from "@mantine/core";
import { TypeBadge } from "@/components/TypeBadge/TypeBadge.tsx";
import type { Component } from "@/types/component.ts";

interface ComponentDetailsProps {
    component: Component;
}

export function ComponentDetails({ component }: ComponentDetailsProps) {
    return (
        <Group gap="xs">
            <TypeBadge
                variant="component"
                type={component.type}
            />
            <Stack gap={0}>
                <Text
                    size="sm"
                    fw={500}
                >
                    {component.type}
                </Text>
                <Text
                    size="xs"
                    c="dimmed"
                    ff="monospace"
                    truncate
                >
                    ID: {component.id}
                </Text>
            </Stack>
        </Group>
    );
}
