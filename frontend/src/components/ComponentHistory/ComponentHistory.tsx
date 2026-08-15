import { Anchor, Box, Breadcrumbs, Group, Tooltip } from "@mantine/core";
import { IconHistory } from "@tabler/icons-react";
import { ComponentDetails } from "@/components/ComponentDetails/ComponentDetails.tsx";
import {
    useComponentHistory,
    useComponentViews,
    useGraphActions,
} from "@/store/graph/selectors.ts";

export function ComponentHistory() {
    const componentHistory = useComponentHistory();
    const componentViews = useComponentViews();
    const { setSelectedComponent } = useGraphActions();

    const data = componentHistory.map((component) => (
        <Tooltip
            key={component.uid}
            label={<ComponentDetails component={component} />}
        >
            <Anchor
                size="xs"
                ff="monospace"
                c="dimmed"
                onClick={() => setSelectedComponent(component)}
            >
                {componentViews[component.type].code} {component.id}
            </Anchor>
        </Tooltip>
    ));

    return (
        <Box
            data-testid="component-history"
            style={{ overflowX: "auto", scrollbarWidth: "none" }}
        >
            <Group
                gap="xs"
                align="center"
                w="max-content"
                miw="100%"
            >
                <Group
                    c="dimmed"
                    justify="center"
                    align="center"
                >
                    <IconHistory size={16} />
                </Group>
                <Breadcrumbs
                    separator="/"
                    separatorMargin={6}
                >
                    {data}
                </Breadcrumbs>
            </Group>
        </Box>
    );
}
