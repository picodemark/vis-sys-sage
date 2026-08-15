import { ActionIcon, Alert, Badge, Button, Group, Paper, Select, Stack, Text } from "@mantine/core";
import type { FileRejection } from "@mantine/dropzone";
import { IconAlertTriangle, IconDatabaseImport, IconX } from "@tabler/icons-react";
import type { SystemDataFiles, SystemDataType } from "@/types/system.ts";
import {
    SYSTEM_DATA_INFO,
    SYSTEM_DATA_TYPES,
    SYSTEM_EXAMPLE_OPTIONS,
    SYSTEM_EXAMPLES,
    type SystemExampleId,
} from "./config.ts";
import { ExampleSelection } from "./ExampleSelection.tsx";
import { ImportDropzone } from "./ImportDropzone.tsx";

interface SystemDataImportPanelProps {
    files: SystemDataFiles;
    selectedType: SystemDataType;
    exampleId: SystemExampleId;
    loading: boolean;
    onDrop: (files: File[]) => void;
    onReject: (rejections: FileRejection[]) => void;
    onTypeChange: (value: string | null) => void;
    onRemoveFile: (type: SystemDataType) => void;
    onExampleChange: (value: SystemExampleId) => void;
    onAddExample: () => void;
    onImport: () => void;
}

export function SystemDataImportPanel({
    files,
    selectedType,
    exampleId,
    loading,
    onDrop,
    onReject,
    onTypeChange,
    onRemoveFile,
    onExampleChange,
    onAddExample,
    onImport,
}: SystemDataImportPanelProps) {
    const hasHwloc = files.hwloc !== undefined;
    const selectedTypeInfo = SYSTEM_DATA_INFO[selectedType];
    const selectedExample = SYSTEM_EXAMPLES[exampleId];
    const typeOptions = SYSTEM_DATA_TYPES.map((value) => ({
        value,
        label: SYSTEM_DATA_INFO[value].label,
        disabled: value !== "hwloc" && !hasHwloc,
    }));
    const fileEntries = SYSTEM_DATA_TYPES.flatMap((type) => {
        const file = files[type];
        return file === undefined ? [] : [{ type, file }];
    });
    const missingHwloc = !hasHwloc && fileEntries.some(({ type }) => type !== "hwloc");

    return (
        <Stack gap="sm">
            <ImportDropzone
                accept={selectedTypeInfo.accept}
                description={selectedTypeInfo.description}
                icon={selectedTypeInfo.icon}
                loading={loading}
                onDrop={onDrop}
                onReject={onReject}
            />

            <Select
                data-testid="system-data-type"
                label="Import data type"
                description={
                    hasHwloc
                        ? "Add or replace measurements. The graph is rebuilt from all listed sources."
                        : "Upload the hwloc XML topology before selecting another source."
                }
                data={typeOptions}
                value={selectedType}
                allowDeselect={false}
                disabled={loading}
                renderOption={({ option }) => <Text ff="monospace">{option.label}</Text>}
                styles={{
                    input: {
                        fontFamily: "var(--mantine-font-family-monospace)",
                    },
                }}
                onChange={onTypeChange}
            />

            {fileEntries.length > 0 && (
                <Stack gap="xs">
                    <Text
                        size="sm"
                        fw={600}
                    >
                        Sources used to rebuild the graph
                    </Text>
                    <Text
                        size="xs"
                        c="dimmed"
                    >
                        These files are saved in this browser and sent together whenever the system
                        graph is updated.
                    </Text>
                    {fileEntries.map(({ type, file }) => (
                        <Paper
                            key={type}
                            data-testid={`system-file-${type}`}
                            withBorder
                            p="xs"
                        >
                            <Group
                                justify="space-between"
                                wrap="nowrap"
                            >
                                <Group
                                    gap="xs"
                                    wrap="nowrap"
                                    miw={0}
                                >
                                    <Badge
                                        variant="light"
                                        ff="monospace"
                                        style={{ flexShrink: 0 }}
                                    >
                                        {SYSTEM_DATA_INFO[type].label}
                                    </Badge>
                                    <Text
                                        size="sm"
                                        ff="monospace"
                                        truncate
                                    >
                                        {file.name}
                                    </Text>
                                </Group>
                                <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    aria-label={`Remove ${SYSTEM_DATA_INFO[type].label} file`}
                                    disabled={loading}
                                    onClick={() => onRemoveFile(type)}
                                >
                                    <IconX size={16} />
                                </ActionIcon>
                            </Group>
                        </Paper>
                    ))}
                </Stack>
            )}

            {missingHwloc && (
                <Alert
                    color="yellow"
                    icon={<IconAlertTriangle size={16} />}
                >
                    Upload the hwloc XML topology before adding or importing other system data.
                </Alert>
            )}

            <ExampleSelection
                options={SYSTEM_EXAMPLE_OPTIONS}
                value={exampleId}
                selectTestId="system-example-select"
                buttonTestId="add-system-example"
                buttonLabel="Add example"
                loading={loading}
                onChange={(value) => onExampleChange(value as SystemExampleId)}
                onAction={onAddExample}
            />

            <Text
                data-testid="system-example-description"
                size="xs"
                c="dimmed"
            >
                {selectedExample.description}
            </Text>

            <Group
                justify="flex-end"
                wrap="wrap"
            >
                <Button
                    data-testid="load-system-graph"
                    leftSection={<IconDatabaseImport size={16} />}
                    disabled={!hasHwloc}
                    loading={loading}
                    w={{ base: "100%", sm: "auto" }}
                    onClick={onImport}
                >
                    Load graph
                </Button>
            </Group>
        </Stack>
    );
}
