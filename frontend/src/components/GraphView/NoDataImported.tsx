import { Box, EmptyState } from "@mantine/core";
import { IconFileUnknown } from "@tabler/icons-react";
import { ImportToggle } from "@/components/ImportToggle/ImportToggle.tsx";

export function NoDataImported() {
    return (
        <Box data-testid="empty-graph-state">
            <EmptyState
                withIndicatorBackground
                icon={<IconFileUnknown />}
                title="No data imported"
            >
                <EmptyState.Description>
                    No data is imported. Add exported Sys-Sage or hardware data to see Component
                    Tree or Relation Graph.
                </EmptyState.Description>
                <EmptyState.Actions>
                    <ImportToggle />
                </EmptyState.Actions>
            </EmptyState>
        </Box>
    );
}
