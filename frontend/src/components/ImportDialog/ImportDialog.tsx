import { Alert, Group, Modal, Stack, Tabs, Title } from "@mantine/core";
import type { FileRejection } from "@mantine/dropzone";
import {
    IconAlertTriangle,
    IconCircleCheck,
    IconDatabaseImport,
    IconDeviceDesktop,
    IconJson,
} from "@tabler/icons-react";
import { useState } from "react";
import { restoreSystemDataFiles } from "@/api/data.ts";
import { ImportError } from "@/errors/ImportError.ts";
import { useGraphActions, useStoredSystemDataFiles } from "@/store/graph/selectors.ts";
import { useSettingsActions, useShowImport } from "@/store/settings/selectors.ts";
import type { SystemDataFiles, SystemDataType } from "@/types/system.ts";
import { type ExampleId, SYSTEM_DATA_TYPES, type SystemExampleId } from "./config.ts";
import { JsonImportPanel } from "./JsonImportPanel.tsx";
import {
    loadExampleGraph,
    loadJsonGraph,
    loadSystemExampleFile,
    loadSystemGraph,
} from "./operations.ts";
import { SystemDataImportPanel } from "./SystemDataImportPanel.tsx";

type ImportMode = "json" | "system";

interface Result {
    status: "success" | "error";
    message: string;
}

export function ImportDialog() {
    const showImport = useShowImport();
    const { setShowImport } = useSettingsActions();
    const { setGraph } = useGraphActions();
    const storedSystemDataFiles = useStoredSystemDataFiles();

    const [mode, setMode] = useState<ImportMode>("json");
    const [systemDataType, setSystemDataType] = useState<SystemDataType>("hwloc");
    const [exampleId, setExampleId] = useState<ExampleId>("hpc");
    const [systemExampleId, setSystemExampleId] = useState<SystemExampleId>("epyc9754");
    const [jsonFile, setJsonFile] = useState<File | null>(null);
    const [systemFiles, setSystemFiles] = useState<SystemDataFiles>({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Result | null>(null);

    function showImportError(error: unknown, fallback: string) {
        setResult({
            status: "error",
            message: error instanceof ImportError ? error.message : fallback,
        });
    }

    function resetFiles() {
        setJsonFile(null);
        setSystemFiles({});
        setSystemDataType("hwloc");
        setResult(null);
    }

    function closeDialog() {
        resetFiles();
        setMode("json");
        setShowImport(false);
    }

    function handleClose() {
        if (!loading) {
            closeDialog();
        }
    }

    function handleModeChange(value: string | null) {
        if (value !== "json" && value !== "system") {
            return;
        }

        setMode(value);
        setJsonFile(null);
        setSystemFiles(value === "system" ? restoreSystemDataFiles(storedSystemDataFiles) : {});
        setSystemDataType("hwloc");
        setResult(null);
    }

    function handleSystemDataTypeChange(value: string | null) {
        const nextType = value as SystemDataType | null;
        if (
            nextType !== null &&
            SYSTEM_DATA_TYPES.includes(nextType) &&
            (nextType === "hwloc" || systemFiles.hwloc !== undefined)
        ) {
            setSystemDataType(nextType);
            setResult(null);
        }
    }

    function handleRemoveSystemFile(typeToRemove: SystemDataType) {
        if (typeToRemove === "hwloc") {
            setSystemDataType("hwloc");
        }
        setSystemFiles(
            (current) =>
                Object.fromEntries(
                    Object.entries(current).filter(([type]) => type !== typeToRemove),
                ) as SystemDataFiles,
        );
        setResult(null);
    }

    function handleDrop(files: File[]) {
        const selectedFile = files[0];
        if (selectedFile === undefined) {
            return;
        }

        if (mode === "json") {
            setJsonFile(selectedFile);
            setResult(null);
            return;
        }

        if (systemDataType !== "hwloc" && systemFiles.hwloc === undefined) {
            setSystemDataType("hwloc");
            setResult({
                status: "error",
                message: "Upload an hwloc XML file before adding other system data.",
            });
            return;
        }

        setSystemFiles((current) => ({ ...current, [systemDataType]: selectedFile }));
        setResult(null);
    }

    function handleReject(rejections: FileRejection[]) {
        setResult({
            status: "error",
            message: rejections[0]?.errors[0]?.message ?? "The file could not be selected.",
        });
    }

    async function handleImport() {
        if (jsonFile === null) {
            return;
        }

        setLoading(true);
        setResult(null);
        try {
            const imported = await loadJsonGraph(jsonFile);
            setGraph(imported.graph, imported.filename);
            closeDialog();
        } catch (error) {
            showImportError(error, "The import failed.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSystemDataImport() {
        if (systemFiles.hwloc === undefined) {
            setSystemDataType("hwloc");
            setResult({
                status: "error",
                message: "Upload an hwloc XML file before loading system data.",
            });
            return;
        }

        setLoading(true);
        setResult(null);
        try {
            const imported = await loadSystemGraph(systemFiles);
            setGraph(imported.graph, imported.filename, imported.storedFiles);
            closeDialog();
        } catch (error) {
            showImportError(error, "The system data import failed.");
        } finally {
            setLoading(false);
        }
    }

    async function handleLoadExample() {
        setLoading(true);
        setResult(null);
        try {
            const imported = await loadExampleGraph(exampleId);
            setGraph(imported.graph, imported.filename);
            setJsonFile(null);
            setResult({
                status: "success",
                message: `${imported.label} was imported.`,
            });
        } catch (error) {
            showImportError(error, "The example import failed.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAddSystemExample() {
        setLoading(true);
        setResult(null);
        try {
            const example = await loadSystemExampleFile(systemExampleId);
            setSystemFiles((current) => ({ ...current, hwloc: example.file }));
            setSystemDataType("hwloc");
            setResult({
                status: "success",
                message: `${example.label} was added as hwloc data.`,
            });
        } catch (error) {
            showImportError(error, "The system example import failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            data-testid="data-import-dialog"
            opened={showImport}
            title={
                <Group gap="xs">
                    <IconDatabaseImport size={18} />
                    <Title order={5}>Import</Title>
                </Group>
            }
            size="lg"
            onClose={handleClose}
            closeButtonProps={{ disabled: loading }}
            closeOnClickOutside={!loading}
            closeOnEscape={!loading}
            returnFocus={false}
            centered
        >
            <Stack gap="sm">
                <Tabs
                    value={mode}
                    onChange={handleModeChange}
                >
                    <Tabs.List grow>
                        <Tabs.Tab
                            data-testid="sys-sage-import-tab"
                            value="json"
                            leftSection={<IconJson size={16} />}
                            disabled={loading}
                        >
                            Sys-Sage data
                        </Tabs.Tab>
                        <Tabs.Tab
                            data-testid="system-data-import-tab"
                            value="system"
                            leftSection={<IconDeviceDesktop size={16} />}
                            disabled={loading}
                        >
                            System data
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel
                        value={mode}
                        pt="sm"
                    >
                        {mode === "json" ? (
                            <JsonImportPanel
                                file={jsonFile}
                                exampleId={exampleId}
                                loading={loading}
                                onDrop={handleDrop}
                                onReject={handleReject}
                                onExampleChange={setExampleId}
                                onLoadExample={handleLoadExample}
                                onImport={handleImport}
                            />
                        ) : (
                            <SystemDataImportPanel
                                files={systemFiles}
                                selectedType={systemDataType}
                                exampleId={systemExampleId}
                                loading={loading}
                                onDrop={handleDrop}
                                onReject={handleReject}
                                onTypeChange={handleSystemDataTypeChange}
                                onRemoveFile={handleRemoveSystemFile}
                                onExampleChange={setSystemExampleId}
                                onAddExample={handleAddSystemExample}
                                onImport={handleSystemDataImport}
                            />
                        )}
                    </Tabs.Panel>
                </Tabs>

                {result !== null && (
                    <Alert
                        color={result.status === "success" ? "green" : "red"}
                        icon={
                            result.status === "success" ? (
                                <IconCircleCheck size={16} />
                            ) : (
                                <IconAlertTriangle size={16} />
                            )
                        }
                    >
                        {result.message}
                    </Alert>
                )}
            </Stack>
        </Modal>
    );
}
