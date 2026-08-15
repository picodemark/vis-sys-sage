import { Box, Group, Text } from "@mantine/core";
import { Dropzone, type FileRejection } from "@mantine/dropzone";
import { IconUpload, IconX, type TablerIcon } from "@tabler/icons-react";
import { MAXIMUM_IMPORT_SIZE_BYTES, MAXIMUM_IMPORT_SIZE_MEBIBYTES } from "./config.ts";

interface ImportDropzoneProps {
    accept: Record<string, string[]>;
    description: string;
    icon: TablerIcon;
    loading: boolean;
    onDrop: (files: File[]) => void;
    onReject: (rejections: FileRejection[]) => void;
}

export function ImportDropzone({
    accept,
    description,
    icon: IdleIcon,
    loading,
    onDrop,
    onReject,
}: ImportDropzoneProps) {
    return (
        <Dropzone
            data-testid="data-import-dropzone"
            onDrop={onDrop}
            onReject={onReject}
            maxFiles={1}
            maxSize={MAXIMUM_IMPORT_SIZE_BYTES}
            accept={accept}
            loading={loading}
        >
            <Group
                justify="center"
                gap="md"
                mih={130}
                style={{ pointerEvents: "none" }}
            >
                <Dropzone.Accept>
                    <IconUpload size={50} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX size={50} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <IdleIcon size={70} />
                </Dropzone.Idle>
                <Box>
                    <Text fw={700}>Drop {description} here or click to browse.</Text>
                    <Text
                        size="xs"
                        c="dimmed"
                    >
                        One file, maximum {MAXIMUM_IMPORT_SIZE_MEBIBYTES} MiB
                    </Text>
                </Box>
            </Group>
        </Dropzone>
    );
}
