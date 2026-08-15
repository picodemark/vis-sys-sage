import { Group, Title } from "@mantine/core";
import { IconCpu, IconLink } from "@tabler/icons-react";
import type { ElementVariant } from "@/types/element.ts";

interface DetailsTitleProps {
    variant: ElementVariant;
}

export function DetailsTitle({ variant }: DetailsTitleProps) {
    const Icon = variant === "component" ? IconCpu : IconLink;

    const title = variant === "component" ? "Component" : "Relation";

    return (
        <Title order={4}>
            <Group gap={6}>
                <Icon size={20} />
                {title}
            </Group>
        </Title>
    );
}
