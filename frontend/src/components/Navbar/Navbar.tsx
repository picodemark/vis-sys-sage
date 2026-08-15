import {
    ActionIcon,
    AppShell,
    Divider,
    Group,
    Pagination,
    ScrollArea,
    SegmentedControl,
    Stack,
    TextInput,
    Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFilterPlus, IconSearch } from "@tabler/icons-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { AdvancedSearchDialog } from "@/components/AdvancedSearchDialog/AdvancedSearchDialog.tsx";
import { ImportArea } from "@/components/ImportArea/ImportArea.tsx";
import { ListElement } from "@/components/ListElement/ListElement.tsx";
import { useSearch } from "@/hooks/useSearch.ts";
import { useGraph, useGraphActions } from "@/store/graph/selectors.ts";
import { useSettingsActions } from "@/store/settings/selectors.ts";
import type { Component } from "@/types/component.ts";
import type { Relation } from "@/types/relation.ts";

const TABS = [
    {
        label: "Tree Roots",
        value: "roots",
    },
    {
        label: "Components",
        value: "components",
    },
    {
        label: "Relations",
        value: "relations",
    },
];

const PAGE_SIZE = 50;
type NavigationTab = "roots" | "components" | "relations";
type NavigationEntity = Component | Relation;

function getSearchIndex(entity: NavigationEntity) {
    return entity.searchIndex;
}

function isRelation(entity: NavigationEntity): entity is Relation {
    return "componentUids" in entity;
}

export function Navbar() {
    const graph = useGraph();
    const { setSelectedComponent } = useGraphActions();
    const { setGraphTab } = useSettingsActions();
    const { componentList, relationList, rootList, topology } = graph;

    const [tab, setTab] = useState<NavigationTab>("roots");
    const [activePage, setActivePage] = useState(1);
    const scrollViewportRef = useRef<HTMLDivElement>(null);

    const [opened, { toggle, close }] = useDisclosure(false);

    const activeElements: NavigationEntity[] =
        tab === "roots" ? rootList : tab === "components" ? componentList : relationList;
    const { searchText, setSearchText, foundElements } = useSearch(activeElements, getSearchIndex);

    const activeSearch =
        tab === "roots"
            ? {
                  placeholder: "Search tree roots",
                  testId: "tree-root-search",
              }
            : tab === "components"
              ? {
                    placeholder: "Search components",
                    testId: "component-search",
                }
              : {
                    placeholder: "Search relations",
                    testId: "relation-search",
                };

    function handlePageChange(page: number) {
        setActivePage(page);
        scrollViewportRef.current?.scrollTo({ top: 0 });
    }

    const handleInput = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        handlePageChange(1);
        setSearchText(event.currentTarget.value);
    };

    function handleTabChange(value: string) {
        if (value === "roots" || value === "components" || value === "relations") {
            setTab(value);
            setSearchText("");
            close();
        }
        handlePageChange(1);
    }

    const totalPages = Math.max(1, Math.ceil(foundElements.length / PAGE_SIZE));
    const currentPage = Math.min(activePage, totalPages);
    const pageStart = (currentPage - 1) * PAGE_SIZE;
    const visibleElements = foundElements.slice(pageStart, pageStart + PAGE_SIZE);

    useEffect(() => {
        if (activePage > totalPages) {
            setActivePage(totalPages);
            scrollViewportRef.current?.scrollTo({ top: 0 });
        }
    }, [activePage, totalPages]);

    const disabledControl =
        rootList.length === 0 && componentList.length === 0 && relationList.length === 0;

    return (
        <>
            {tab === "relations" ? (
                <AdvancedSearchDialog
                    key={tab}
                    variant="relation"
                    opened={opened}
                    close={close}
                    elements={relationList}
                />
            ) : (
                <AdvancedSearchDialog
                    key={tab}
                    variant="component"
                    opened={opened}
                    close={close}
                    elements={tab === "roots" ? rootList : componentList}
                />
            )}
            <AppShell.Section>
                <Group justify="center">
                    <SegmentedControl
                        data-testid="navigation-tabs"
                        data={TABS}
                        value={tab}
                        onChange={handleTabChange}
                        m="xs"
                        size="xs"
                        disabled={disabledControl}
                        fullWidth
                    />
                </Group>
            </AppShell.Section>
            <AppShell.Section
                p="xs"
                pt="0"
            >
                <Group gap="xs">
                    <TextInput
                        data-testid={activeSearch.testId}
                        value={searchText}
                        flex={1}
                        miw={0}
                        placeholder={activeSearch.placeholder}
                        aria-label={`${activeSearch.placeholder} by type or ID`}
                        leftSection={<IconSearch size={14} />}
                        onChange={handleInput}
                        disabled={activeElements.length === 0}
                    />
                    <Tooltip label="Advanced search">
                        <ActionIcon
                            data-testid="open-advanced-search"
                            variant="default"
                            aria-label="Advanced search"
                            onClick={toggle}
                            disabled={activeElements.length === 0}
                        >
                            <IconFilterPlus size={16} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </AppShell.Section>
            {tab === "roots" && topology !== undefined && (
                <AppShell.Section px="xs">
                    <ListElement
                        testId="navigation-topology"
                        variant="component"
                        display="metadata"
                        component={topology}
                        onSelect={(component) => {
                            setGraphTab("componentTree");
                            setSelectedComponent(component);
                        }}
                    />
                </AppShell.Section>
            )}
            <AppShell.Section
                grow
                component={ScrollArea}
                viewportRef={scrollViewportRef}
            >
                <Stack
                    gap={0}
                    px="xs"
                >
                    {visibleElements.map((entity) =>
                        isRelation(entity) ? (
                            <ListElement
                                testId={`navigation-relations-${entity.uid}`}
                                key={`relations-${entity.uid}`}
                                variant="relation"
                                relation={entity}
                            />
                        ) : (
                            <ListElement
                                testId={`navigation-${tab}-${entity.uid}`}
                                key={`${tab}-${entity.uid}`}
                                variant="component"
                                display="metadata"
                                component={entity}
                            />
                        ),
                    )}
                </Stack>
            </AppShell.Section>
            {totalPages > 1 && (
                <AppShell.Section p="xs">
                    <Group justify="center">
                        <Pagination
                            size="xs"
                            total={totalPages}
                            value={currentPage}
                            boundaries={1}
                            siblings={0}
                            onChange={handlePageChange}
                        />
                    </Group>
                </AppShell.Section>
            )}
            <Divider />
            <AppShell.Section p="xs">
                <ImportArea />
            </AppShell.Section>
        </>
    );
}
