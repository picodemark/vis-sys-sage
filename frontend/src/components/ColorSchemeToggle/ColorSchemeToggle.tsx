import { ActionIcon, Tooltip, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ColorSchemeToggle() {
    const { setColorScheme } = useMantineColorScheme();
    const computed = useComputedColorScheme("light");
    const mode = computed === "light" ? "dark" : "light";
    const label = `Change to ${mode} mode`;

    return (
        <Tooltip label={label}>
            <ActionIcon
                variant="default"
                aria-label={label}
                onClick={() => setColorScheme(mode)}
            >
                {computed === "light" ? <IconSun size={16} /> : <IconMoon size={16} />}
            </ActionIcon>
        </Tooltip>
    );
}
