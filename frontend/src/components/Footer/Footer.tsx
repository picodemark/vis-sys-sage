import { Anchor, Group, Text } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";

const VIS_SYS_SAGE_REPOSITORY = "https://github.com/picodemark/vis-sys-sage";
const SYS_SAGE_REPOSITORY = "https://github.com/caps-tum/sys-sage";
const LICENSE = "Apache-2.0 license";

export function Footer() {
    return (
        <Group
            h="100%"
            px="sm"
            gap="sm"
            justify="flex-end"
        >
            <Group gap={5}>
                <IconBrandGithub size={16} />
                <Text
                    size="xs"
                    c="dimmed"
                >
                    Source:
                </Text>
                <Anchor
                    href={VIS_SYS_SAGE_REPOSITORY}
                    target="_blank"
                    rel="noreferrer"
                    size="xs"
                >
                    vis-sys-sage
                </Anchor>
                <Text
                    size="xs"
                    c="dimmed"
                >
                    ·
                </Text>
                <Anchor
                    href={SYS_SAGE_REPOSITORY}
                    target="_blank"
                    rel="noreferrer"
                    size="xs"
                >
                    sys-sage
                </Anchor>
            </Group>
            <Text
                size="xs"
                c="dimmed"
            >
                {LICENSE}
            </Text>
        </Group>
    );
}
