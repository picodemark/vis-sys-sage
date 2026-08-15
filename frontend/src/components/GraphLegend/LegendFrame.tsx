import { Badge, Box, Button, Divider, Group, Popover, Stack, Text } from "@mantine/core";
import { IconListDetails } from "@tabler/icons-react";
import { type ReactNode, useState } from "react";

interface LegendFrameProps {
    graphType: string;
    testIdPrefix: "component-tree" | "relation-graph";
    description: string;
    children: ReactNode;
}

export function LegendFrame({ graphType, testIdPrefix, description, children }: LegendFrameProps) {
    const [opened, setOpened] = useState(false);

    return (
        <Popover
            opened={opened}
            onChange={setOpened}
            position="top-start"
            width={280}
            shadow="md"
            withArrow
        >
            <Popover.Target>
                <Button
                    data-testid={`${testIdPrefix}-legend-toggle`}
                    variant="default"
                    size="compact-sm"
                    leftSection={<IconListDetails size={15} />}
                    aria-expanded={opened}
                    onClick={() => setOpened((current) => !current)}
                >
                    Legend
                </Button>
            </Popover.Target>
            <Popover.Dropdown
                data-testid={`${testIdPrefix}-legend`}
                p="xs"
                role="note"
                aria-label={`${graphType} legend`}
            >
                <Box
                    mah="min(340px, 46vh)"
                    style={{ overflowY: "auto", scrollbarWidth: "thin" }}
                >
                    <Stack gap="xs">
                        <Group
                            justify="space-between"
                            gap="xs"
                            wrap="nowrap"
                        >
                            <Text
                                size="sm"
                                fw={700}
                            >
                                Legend
                            </Text>
                            <Badge
                                variant="light"
                                size="xs"
                            >
                                {graphType}
                            </Badge>
                        </Group>
                        <Text
                            size="xs"
                            c="dimmed"
                        >
                            {description}
                        </Text>
                        <Divider />
                        {children}
                    </Stack>
                </Box>
            </Popover.Dropdown>
        </Popover>
    );
}
