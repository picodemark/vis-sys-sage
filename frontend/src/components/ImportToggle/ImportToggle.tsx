import { Button, Tooltip } from "@mantine/core";
import { IconDatabaseImport } from "@tabler/icons-react";
import { useSettingsActions } from "@/store/settings/selectors.ts";

interface ImportToggleProps {
    label?: string;
    onClick?: () => void;
    testId?: string;
    tooltip?: string;
}

export function ImportToggle({
    label = "Import",
    onClick,
    testId = "open-data-import",
    tooltip,
}: ImportToggleProps) {
    const { setShowImport } = useSettingsActions();

    const button = (
        <Button
            data-testid={testId}
            size="sm"
            px="xs"
            leftSection={<IconDatabaseImport size={15} />}
            onClick={() => {
                onClick?.();
                setShowImport(true);
            }}
        >
            {label}
        </Button>
    );

    return tooltip === undefined ? button : <Tooltip label={tooltip}>{button}</Tooltip>;
}
