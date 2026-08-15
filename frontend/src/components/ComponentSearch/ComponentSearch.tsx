import { Button, EmptyState, Text } from "@mantine/core";
import { Spotlight, spotlight } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import { ComponentDetails } from "@/components/ComponentDetails/ComponentDetails.tsx";
import { ImportToggle } from "@/components/ImportToggle/ImportToggle.tsx";
import { useSearch } from "@/hooks/useSearch.ts";
import { useGraphActions, useRootList } from "@/store/graph/selectors.ts";
import type { Component } from "@/types/component.ts";

const MAX_NUMBER_SEARCH_RESULTS = 7;

function getSearchIndex(component: Component) {
    return component.searchIndex;
}

export function ComponentSearch() {
    const rootList = useRootList();
    const { setSelectedComponent } = useGraphActions();

    const { searchText, setSearchText, foundElements } = useSearch(rootList, getSearchIndex);

    return (
        <>
            <Button
                data-testid="open-spotlight-search"
                leftSection={<IconSearch size={14} />}
                aria-label="Search"
                onClick={spotlight.open}
            >
                <Text
                    size="xs"
                    fw={500}
                    visibleFrom="sm"
                >
                    Search
                </Text>
            </Button>
            <Spotlight.Root
                data-testid="spotlight-search"
                query={searchText}
                onQueryChange={setSearchText}
                scrollable
            >
                <Spotlight.Search
                    data-testid="spotlight-search-input"
                    placeholder="Search tree roots"
                    aria-label="Search tree roots by type or ID"
                    leftSection={
                        <IconSearch
                            size={18}
                            stroke={1.5}
                        />
                    }
                ></Spotlight.Search>
                <Spotlight.ActionsList>
                    {foundElements.length === 0 && (
                        <Spotlight.Empty>
                            <EmptyState>
                                <EmptyState.Indicator>
                                    <IconSearch />
                                </EmptyState.Indicator>
                                <EmptyState.Title>No results found</EmptyState.Title>
                                <EmptyState.Description>
                                    Import data for search
                                </EmptyState.Description>
                                <EmptyState.Actions>
                                    <ImportToggle
                                        testId="spotlight-open-data-import"
                                        onClick={spotlight.close}
                                    />
                                </EmptyState.Actions>
                            </EmptyState>
                        </Spotlight.Empty>
                    )}
                    {foundElements.slice(0, MAX_NUMBER_SEARCH_RESULTS).map((component) => (
                        <Spotlight.Action
                            data-testid={`spotlight-result-${component.uid}`}
                            key={component.uid}
                            label={component.type}
                            description={`ID: ${component.id}`}
                            onClick={() => setSelectedComponent(component)}
                        >
                            <ComponentDetails component={component} />
                        </Spotlight.Action>
                    ))}
                </Spotlight.ActionsList>
            </Spotlight.Root>
        </>
    );
}
