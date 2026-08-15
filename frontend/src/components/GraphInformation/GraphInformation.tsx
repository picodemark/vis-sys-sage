import {
    Badge,
    Button,
    Group,
    Modal,
    Paper,
    RingProgress,
    SimpleGrid,
    Stack,
    Table,
    Text,
    Title,
    Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconArrowsShuffle,
    IconBinaryTree,
    IconBoxMultiple,
    IconChartBar,
    IconLayersLinked,
    IconLink,
    IconListTree,
    IconTopologyFullHierarchy,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useFilename, useGraphMetadata } from "@/store/graph/selectors.ts";

interface SummaryValueProps {
    icon: ReactNode;
    label: string;
    value: number;
}

function SummaryValue({ icon, label, value }: SummaryValueProps) {
    return (
        <Paper
            withBorder
            p="sm"
            radius="md"
        >
            <Group
                gap={5}
                c="dimmed"
                wrap="nowrap"
            >
                {icon}
                <Text
                    size="xs"
                    fw={600}
                >
                    {label}
                </Text>
            </Group>
            <Text
                size="xl"
                fw={700}
                ff="monospace"
            >
                {value.toLocaleString()}
            </Text>
        </Paper>
    );
}

function formatAverage(value: number) {
    return value.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}

export function GraphInformation() {
    const metadata = useGraphMetadata();
    const filename = useFilename();
    const [opened, { open, close }] = useDisclosure(false);
    const crossTreePercentage =
        metadata.relationCount === 0
            ? 0
            : (metadata.crossTreeRelationCount / metadata.relationCount) * 100;
    const perComponentMetrics = [
        {
            label: "Relations",
            icon: <IconLink size={15} />,
            values: metadata.relationsPerComponent,
        },
        {
            label: "Direct children",
            icon: <IconListTree size={15} />,
            values: metadata.childrenPerComponent,
        },
    ];

    return (
        <>
            <Modal
                data-testid="graph-information-dialog"
                opened={opened}
                onClose={close}
                title={
                    <Group gap="xs">
                        <IconChartBar size={18} />
                        <Title order={5}>Graph Information</Title>
                    </Group>
                }
                centered
                size="lg"
                overlayProps={{ backgroundOpacity: 0.5, blur: 3 }}
            >
                <Stack gap="md">
                    {filename !== undefined && (
                        <Text
                            size="xs"
                            c="dimmed"
                            ff="monospace"
                        >
                            {filename}
                        </Text>
                    )}
                    <SimpleGrid cols={{ base: 2, sm: 4 }}>
                        <SummaryValue
                            icon={<IconBoxMultiple size={15} />}
                            label="Components"
                            value={metadata.componentCount}
                        />
                        <SummaryValue
                            icon={<IconLink size={15} />}
                            label="Relations"
                            value={metadata.relationCount}
                        />
                        <SummaryValue
                            icon={<IconBinaryTree size={15} />}
                            label="Component trees"
                            value={metadata.componentTreeCount}
                        />
                        <Paper
                            withBorder
                            p="sm"
                            radius="md"
                        >
                            <Group
                                gap={5}
                                c="dimmed"
                                wrap="nowrap"
                            >
                                <IconTopologyFullHierarchy size={15} />
                                <Text
                                    size="xs"
                                    fw={600}
                                >
                                    Topology
                                </Text>
                            </Group>
                            <Badge
                                mt={5}
                                variant="light"
                                color={metadata.hasTopology ? "green" : "gray"}
                            >
                                {metadata.hasTopology ? "Present" : "Not present"}
                            </Badge>
                        </Paper>
                    </SimpleGrid>

                    <Stack gap={6}>
                        <Group
                            gap={6}
                            wrap="nowrap"
                        >
                            <IconChartBar size={16} />
                            <Text
                                size="sm"
                                fw={600}
                            >
                                Per component
                            </Text>
                        </Group>
                        <Table
                            withTableBorder
                            withColumnBorders
                            striped
                        >
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Metric</Table.Th>
                                    <Table.Th>Average</Table.Th>
                                    <Table.Th>Minimum</Table.Th>
                                    <Table.Th>Maximum</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {perComponentMetrics.map(({ label, icon, values }) => (
                                    <Table.Tr key={label}>
                                        <Table.Td>
                                            <Group
                                                gap={6}
                                                wrap="nowrap"
                                            >
                                                {icon}
                                                <Text size="sm">{label}</Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td ff="monospace">
                                            {formatAverage(values.average)}
                                        </Table.Td>
                                        <Table.Td ff="monospace">
                                            {values.min.toLocaleString()}
                                        </Table.Td>
                                        <Table.Td ff="monospace">
                                            {values.max.toLocaleString()}
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Stack>

                    <SimpleGrid cols={{ base: 1, xs: 2 }}>
                        <SummaryValue
                            icon={<IconLayersLinked size={15} />}
                            label="Maximum tree levels"
                            value={metadata.maxTreeDepth}
                        />
                        <Paper
                            withBorder
                            p="xs"
                            radius="md"
                        >
                            <Group
                                gap="sm"
                                wrap="nowrap"
                            >
                                <RingProgress
                                    size={72}
                                    thickness={7}
                                    roundCaps
                                    sections={[{ value: crossTreePercentage, color: "blue" }]}
                                    label={
                                        <Text
                                            ta="center"
                                            size="xs"
                                            fw={700}
                                            ff="monospace"
                                        >
                                            {formatAverage(crossTreePercentage)}%
                                        </Text>
                                    }
                                />
                                <Stack gap={0}>
                                    <Group
                                        gap={5}
                                        c="dimmed"
                                        wrap="nowrap"
                                    >
                                        <IconArrowsShuffle size={15} />
                                        <Text
                                            size="xs"
                                            fw={600}
                                        >
                                            Cross-tree relations
                                        </Text>
                                    </Group>
                                    <Text
                                        size="lg"
                                        fw={700}
                                        ff="monospace"
                                    >
                                        {metadata.crossTreeRelationCount.toLocaleString()}
                                    </Text>
                                    <Text
                                        size="xs"
                                        c="dimmed"
                                    >
                                        of {metadata.relationCount.toLocaleString()} relations
                                    </Text>
                                </Stack>
                            </Group>
                        </Paper>
                    </SimpleGrid>

                    <Text
                        size="xs"
                        c="dimmed"
                    >
                        Per-component statistics include components with no children or relations.
                        When present, the Topology counts as a component and adds a level above the
                        component trees.
                    </Text>
                </Stack>
            </Modal>
            <Tooltip label="Graph information">
                <Button
                    data-testid="open-graph-information"
                    variant="default"
                    size="sm"
                    px="xs"
                    leftSection={<IconChartBar size={15} />}
                    aria-label="Graph information"
                    onClick={open}
                    disabled={metadata.componentCount === 0}
                >
                    Info
                </Button>
            </Tooltip>
        </>
    );
}
