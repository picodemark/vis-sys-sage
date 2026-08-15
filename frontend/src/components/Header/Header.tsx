import { Group, Title } from "@mantine/core";
import { ColorSchemeToggle } from "@/components/ColorSchemeToggle/ColorSchemeToggle.tsx";
import { ComponentSearch } from "@/components/ComponentSearch/ComponentSearch.tsx";
import { FullscreenToggle } from "@/components/FullscreenToggle/FullscreenToggle.tsx";
import { SidebarToggle } from "@/components/SidebarToggle/SidebarToggle.tsx";

interface HeaderProps {
    asideOpened: boolean;
    fullscreen: boolean;
    navbarOpened: boolean;
    toggleAside: () => void;
    toggleFullscreen: () => void;
    toggleNavbar: () => void;
}

export function Header({
    asideOpened,
    fullscreen,
    navbarOpened,
    toggleAside,
    toggleFullscreen,
    toggleNavbar,
}: HeaderProps) {
    return (
        <Group
            h="100%"
            px="sm"
            gap="xs"
            justify="space-between"
        >
            <Group gap="xs">
                <SidebarToggle
                    variant="left"
                    opened={navbarOpened}
                    toggle={toggleNavbar}
                />
                <Title
                    order={4}
                    visibleFrom="xs"
                >
                    Vis-Sys-Sage
                </Title>
            </Group>
            <Group gap="xs">
                <ComponentSearch />
                <ColorSchemeToggle />
                <FullscreenToggle
                    fullscreen={fullscreen}
                    toggle={toggleFullscreen}
                />
                <SidebarToggle
                    variant="right"
                    opened={asideOpened}
                    toggle={toggleAside}
                />
            </Group>
        </Group>
    );
}
