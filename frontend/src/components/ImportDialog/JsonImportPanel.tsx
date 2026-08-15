import { Button, Group, Stack, Text } from "@mantine/core";
import type { FileRejection } from "@mantine/dropzone";
import { IconDatabaseImport, IconJson } from "@tabler/icons-react";
import { EXAMPLE_OPTIONS, EXAMPLES, type ExampleId, JSON_ACCEPTED_FILES } from "./config.ts";
import { ExampleSelection } from "./ExampleSelection.tsx";
import { ImportDropzone } from "./ImportDropzone.tsx";

interface JsonImportPanelProps {
    file: File | null;
    exampleId: ExampleId;
    loading: boolean;
    onDrop: (files: File[]) => void;
    onReject: (rejections: FileRejection[]) => void;
    onExampleChange: (value: ExampleId) => void;
    onLoadExample: () => void;
    onImport: () => void;
}

export function JsonImportPanel({
    file,
    exampleId,
    loading,
    onDrop,
    onReject,
    onExampleChange,
    onLoadExample,
    onImport,
}: JsonImportPanelProps) {
    const selectedExample = EXAMPLES[exampleId];

    return (
        <Stack gap="sm">
            <ImportDropzone
                accept={JSON_ACCEPTED_FILES}
                description="Sys-Sage JSON"
                icon={IconJson}
                loading={loading}
                onDrop={onDrop}
                onReject={onReject}
            />

            {file !== null && (
                <Text size="sm">
                    Selected:{" "}
                    <Text
                        span
                        ff="monospace"
                    >
                        {file.name}
                    </Text>
                </Text>
            )}

            <ExampleSelection
                options={EXAMPLE_OPTIONS}
                value={exampleId}
                selectTestId="json-example-select"
                buttonTestId="load-json-example"
                buttonLabel="Load example"
                loading={loading}
                onChange={(value) => onExampleChange(value as ExampleId)}
                onAction={onLoadExample}
            />

            <Text
                data-testid="json-example-description"
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
                    data-testid="import-json-file"
                    leftSection={<IconDatabaseImport size={16} />}
                    disabled={file === null}
                    loading={loading}
                    w={{ base: "100%", sm: "auto" }}
                    onClick={onImport}
                >
                    Import and show
                </Button>
            </Group>
        </Stack>
    );
}
