import { ActionIcon, Tooltip } from "@mantine/core";
import { IconMaximize, IconMinimize } from "@tabler/icons-react";

interface FullscreenToggleProps {
    fullscreen: boolean;
    toggle: () => void;
}

export function FullscreenToggle({ fullscreen, toggle }: FullscreenToggleProps) {
    const Icon = fullscreen ? IconMinimize : IconMaximize;
    const actionLabel = `Turn ${fullscreen ? "off" : "on"} fullscreen mode`;

    return (
        <Tooltip label={actionLabel}>
            <ActionIcon
                variant="default"
                aria-label={actionLabel}
                onClick={toggle}
            >
                <Icon size={16} />
            </ActionIcon>
        </Tooltip>
    );
}
