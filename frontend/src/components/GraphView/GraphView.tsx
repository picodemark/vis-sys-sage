import { Box, Center, Divider, Group, SegmentedControl, Stack } from "@mantine/core";
import { type ReactNode, useEffect, useMemo } from "react";
import { ComponentHistory } from "@/components/ComponentHistory/ComponentHistory.tsx";
import { ComponentTree } from "@/components/ComponentTree/ComponentTree.tsx";
import { NoDataImported } from "@/components/GraphView/NoDataImported.tsx";
import { RelationGraph } from "@/components/RelationGraph/RelationGraph.tsx";
import { TopologyOverview } from "@/components/TopologyOverview/TopologyOverview.tsx";
import { useGraph, useGraphActions, useSelectedComponent } from "@/store/graph/selectors.ts";
import { useGraphTab, useSettingsActions } from "@/store/settings/selectors.ts";
import type { GraphTab } from "@/types/tab.ts";

const TABS = [
    {
        label: "Component Tree",
        value: "componentTree",
    },
    {
        label: "Relation Graph",
        value: "relationGraph",
    },
];

export function GraphView() {
    const graph = useGraph();
    const selectedComponent = useSelectedComponent();
    const components = graph.components;
    const selectedRelations = useMemo(
        () =>
            selectedComponent?.relations.flatMap((relationUid) => {
                const relation = graph.relations.get(relationUid);
                return relation === undefined ? [] : [relation];
            }) ?? [],
        [graph.relations, selectedComponent],
    );
    const { setSelectedComponent, setSelectedRelationUid } = useGraphActions();
    const tab = useGraphTab();
    const { setGraphTab } = useSettingsActions();
    const topologySelected =
        graph.topology !== undefined && selectedComponent?.uid === graph.topology.uid;
    const activeTab = topologySelected ? "componentTree" : tab;
    const hasRelations = !topologySelected && (selectedComponent?.relations.length ?? 0) > 0;
    const tabs = TABS.map((tabOption) =>
        tabOption.value === "relationGraph" ? { ...tabOption, disabled: !hasRelations } : tabOption,
    );

    useEffect(() => {
        if (topologySelected && tab !== "componentTree") {
            setGraphTab("componentTree");
        }
    }, [setGraphTab, tab, topologySelected]);

    const empty =
        graph.componentList.length === 0 &&
        graph.relationList.length === 0 &&
        graph.topology === undefined;

    const subComponents =
        selectedComponent !== undefined ? components.get(selectedComponent.rootUid) : undefined;

    const root =
        selectedComponent === undefined
            ? undefined
            : graph.componentsByUid.get(selectedComponent.rootUid);

    let content: ReactNode = null;
    if (topologySelected && graph.topology !== undefined) {
        content = (
            <TopologyOverview
                topology={graph.topology}
                components={graph.topologyOverviewComponents}
                componentsByUid={graph.componentsByUid}
                onSelect={setSelectedComponent}
            />
        );
    } else if (
        selectedComponent !== undefined &&
        subComponents !== undefined &&
        root !== undefined
    ) {
        content =
            activeTab === "componentTree" ? (
                <ComponentTree
                    variant="expandable"
                    root={root}
                    selectedComponent={selectedComponent}
                    components={subComponents}
                    onSelect={setSelectedComponent}
                />
            ) : (
                <RelationGraph
                    root={root}
                    selectedComponent={selectedComponent}
                    componentsByUid={graph.componentsByUid}
                    rootOrderByUid={graph.rootOrderByUid}
                    relations={selectedRelations}
                    onSelect={setSelectedComponent}
                    onSelectRelation={setSelectedRelationUid}
                />
            );
    }

    if (empty) {
        return (
            <Center pt="xl">
                <NoDataImported />
            </Center>
        );
    }

    return (
        <Stack
            data-testid="graph-workspace"
            h="calc(100dvh - var(--app-shell-header-height) - var(--app-shell-footer-height))"
            gap={0}
            style={{ overflow: "hidden" }}
        >
            <Box p={6}>
                <ComponentHistory />
            </Box>
            <Divider />
            <Group
                justify="center"
                align="center"
                px="xs"
                py={6}
            >
                <SegmentedControl
                    data-testid="graph-tabs"
                    data={tabs}
                    value={activeTab}
                    onChange={(value) => setGraphTab(value as GraphTab)}
                    size="xs"
                />
            </Group>
            <Divider />
            <Box style={{ flex: 1, minHeight: 0 }}>{content}</Box>
        </Stack>
    );
}
