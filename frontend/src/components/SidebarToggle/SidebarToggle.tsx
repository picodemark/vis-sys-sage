import { ActionIcon, Tooltip } from "@mantine/core";
import {
    IconLayoutSidebarLeftCollapseFilled,
    IconLayoutSidebarLeftExpandFilled,
    IconLayoutSidebarRightCollapseFilled,
    IconLayoutSidebarRightExpandFilled,
} from "@tabler/icons-react";

type SidebarToggleVariant = "left" | "right";

interface SideBarToggleProps {
    variant: SidebarToggleVariant;
    opened: boolean;
    toggle: () => void;
}

export function SidebarToggle({ variant, opened, toggle }: SideBarToggleProps) {
    const stateText = opened ? "Close" : "Open";
    const sideText = variant === "left" ? "left" : "right";
    const label = `${stateText} ${sideText} sidebar`;
    const Icon =
        variant === "left"
            ? opened
                ? IconLayoutSidebarLeftCollapseFilled
                : IconLayoutSidebarLeftExpandFilled
            : opened
              ? IconLayoutSidebarRightCollapseFilled
              : IconLayoutSidebarRightExpandFilled;

    return (
        <Tooltip label={label}>
            <ActionIcon
                data-testid={`${variant}-sidebar-toggle`}
                variant="default"
                aria-label={label}
                aria-expanded={opened}
                onClick={toggle}
            >
                <Icon size={16} />
            </ActionIcon>
        </Tooltip>
    );
}
