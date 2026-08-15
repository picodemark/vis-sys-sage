import { Button, Group, Stack, Text, Tooltip } from "@mantine/core";
import { IconRotateClockwise } from "@tabler/icons-react";
import { GraphInformation } from "@/components/GraphInformation/GraphInformation.tsx";
import { ImportToggle } from "@/components/ImportToggle/ImportToggle.tsx";
import { useFilename, useGraphActions } from "@/store/graph/selectors.ts";

export function ImportArea() {
    const filename = useFilename();
    const { clearGraph } = useGraphActions();

    return (
        <Stack
            gap="xs"
            data-testid="data-actions"
        >
            <Tooltip label={filename ? `Data from ${filename}` : "nothing imported"}>
                <Text
                    size="xs"
                    c="dimmed"
                    ff="monospace"
                    truncate
                >
                    {filename ?? "nothing imported"}
                </Text>
            </Tooltip>
            <Group
                grow
                gap="xs"
                wrap="nowrap"
                w="100%"
            >
                <ImportToggle
                    label="Data"
                    tooltip="Import data"
                />
                <GraphInformation />
                <Tooltip label="Reset graph">
                    <Button
                        data-testid="reset-graph"
                        variant="default"
                        size="sm"
                        px="xs"
                        color="red"
                        leftSection={<IconRotateClockwise size={15} />}
                        aria-label="Reset graph"
                        onClick={clearGraph}
                        disabled={filename === undefined}
                    >
                        Reset
                    </Button>
                </Tooltip>
            </Group>
        </Stack>
    );
}
