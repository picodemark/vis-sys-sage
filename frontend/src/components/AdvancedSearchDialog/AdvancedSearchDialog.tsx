import {
    Center,
    Group,
    Modal,
    Pagination,
    Stack,
    Table,
    Text,
    TextInput,
    Title,
    UnstyledButton,
} from "@mantine/core";
import {
    IconArrowNarrowDown,
    IconArrowNarrowUp,
    IconArrowsUpDown,
    IconFilterPlus,
    IconSearch,
} from "@tabler/icons-react";
import { type ChangeEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { TypeBadge } from "@/components/TypeBadge/TypeBadge.tsx";
import { useSearch } from "@/hooks/useSearch.ts";
import {
    useGraphActions,
    useSelectedComponent,
    useSelectedRelation,
} from "@/store/graph/selectors.ts";
import type { Component } from "@/types/component.ts";
import type { Relation } from "@/types/relation.ts";
import { sortByKey } from "@/util/sort.ts";

const PAGE_SIZE = 8;

type SearchEntity = Component | Relation;
type SortField = "type" | "id" | "children" | "relations" | "category" | "components" | "ordered";

function getSearchIndex(entity: SearchEntity) {
    return entity.searchIndex;
}

function isRelation(entity: SearchEntity): entity is Relation {
    return "componentUids" in entity;
}

interface ThProps {
    children: ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort: () => void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
    const Icon = sorted ? (reversed ? IconArrowNarrowDown : IconArrowNarrowUp) : IconArrowsUpDown;

    return (
        <Table.Th p={0}>
            <UnstyledButton
                w="100%"
                p="var(--mantine-spacing-xs) var(--mantine-spacing-md)"
                onClick={onSort}
            >
                <Group justify="space-between">
                    <Text
                        fw={600}
                        fz="sm"
                    >
                        {children}
                    </Text>
                    <Center
                        w="22px"
                        h="22px"
                        style={{ borderRadius: "22px" }}
                    >
                        <Icon
                            size={16}
                            stroke={1.5}
                        />
                    </Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    );
}

interface CommonProps {
    opened: boolean;
    close: () => void;
}

interface ComponentVariantProps extends CommonProps {
    variant: "component";
    elements: Component[];
}

interface RelationVariantProps extends CommonProps {
    variant: "relation";
    elements: Relation[];
}

type AdvancedSearchDialogProps = ComponentVariantProps | RelationVariantProps;

export function AdvancedSearchDialog({
    opened,
    close,
    elements,
    variant,
}: AdvancedSearchDialogProps) {
    const selectedComponent = useSelectedComponent();
    const selectedRelation = useSelectedRelation();
    const { setSelectedComponent, setSelectedRelationUid } = useGraphActions();
    const searchElements: SearchEntity[] = elements;
    const { searchText, setSearchText, foundElements } = useSearch(searchElements, getSearchIndex);
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortReversed, setSortReversed] = useState(false);
    const [activePage, setPage] = useState(1);

    const sortedData = useMemo(() => {
        if (sortField === null) {
            return foundElements;
        }

        const sortableEntities = foundElements.map((entity) => ({
            entity,
            type: entity.type,
            id: entity.id,
            children: isRelation(entity) ? 0 : (entity.children?.length ?? 0),
            relations: isRelation(entity) ? 0 : entity.relations.length,
            category: isRelation(entity) ? entity.category : 0,
            components: isRelation(entity) ? entity.componentUids.length : 0,
            ordered: isRelation(entity) && entity.ordered ? "Ordered" : "Unordered",
        }));

        return sortByKey(sortableEntities, sortField, sortReversed).map(({ entity }) => entity);
    }, [foundElements, sortField, sortReversed]);
    const totalPages = Math.max(1, Math.ceil(sortedData.length / PAGE_SIZE));
    const pageStart = (activePage - 1) * PAGE_SIZE;

    function setSorting(field: SortField) {
        setSortReversed(field === sortField ? !sortReversed : false);
        setSortField(field);
        setPage(1);
    }

    function handleSearch(event: ChangeEvent<HTMLInputElement>) {
        setSearchText(event.currentTarget.value);
        setPage(1);
    }

    function handleSelect(entity: SearchEntity) {
        if (isRelation(entity)) {
            setSelectedRelationUid(entity.uid);
        } else {
            setSelectedComponent(entity);
        }
        close();
    }

    useEffect(() => {
        if (activePage > totalPages) {
            setPage(totalPages);
        }
    }, [activePage, totalPages]);

    const rows = sortedData.slice(pageStart, pageStart + PAGE_SIZE).map((entity) => {
        if (isRelation(entity)) {
            return (
                <Table.Tr
                    data-testid={`advanced-search-relation-result-${entity.uid}`}
                    key={entity.uid}
                    onClick={() => handleSelect(entity)}
                    bg={
                        entity.uid === selectedRelation?.uid
                            ? "var(--mantine-primary-color-light)"
                            : undefined
                    }
                    style={{ cursor: "pointer" }}
                >
                    <Table.Td>
                        <Group>
                            <TypeBadge
                                variant="relation"
                                type={entity.type}
                            />
                            <Text
                                size="sm"
                                fw={500}
                            >
                                {entity.type}
                            </Text>
                        </Group>
                    </Table.Td>
                    <Table.Td>{entity.id}</Table.Td>
                    <Table.Td>{entity.category}</Table.Td>
                    <Table.Td>{entity.componentUids.length}</Table.Td>
                    <Table.Td>{entity.ordered ? "Ordered" : "Unordered"}</Table.Td>
                </Table.Tr>
            );
        }

        return (
            <Table.Tr
                data-testid={`advanced-search-result-${entity.uid}`}
                key={entity.uid}
                onClick={() => handleSelect(entity)}
                bg={
                    entity.uid === selectedComponent?.uid
                        ? "var(--mantine-primary-color-light)"
                        : undefined
                }
                style={{ cursor: "pointer" }}
            >
                <Table.Td>
                    <Group>
                        <TypeBadge
                            variant="component"
                            type={entity.type}
                        />
                        <Text
                            size="sm"
                            fw={500}
                        >
                            {entity.type}
                        </Text>
                    </Group>
                </Table.Td>
                <Table.Td>{entity.id}</Table.Td>
                <Table.Td>{entity.children?.length ?? 0}</Table.Td>
                <Table.Td>{entity.relations.length}</Table.Td>
            </Table.Tr>
        );
    });

    return (
        <Modal
            data-testid="advanced-search-dialog"
            opened={opened}
            title={
                <Group gap="xs">
                    <IconFilterPlus size={18} />
                    <Title order={5}>
                        {variant === "relation" ? "Advanced Relation Search" : "Advanced Search"}
                    </Title>
                </Group>
            }
            size="xl"
            overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
            onClose={close}
        >
            <Stack>
                <TextInput
                    data-testid="advanced-search-input"
                    value={searchText}
                    placeholder="Search by type or ID"
                    aria-label="Search by type or ID"
                    leftSection={<IconSearch size={14} />}
                    onChange={handleSearch}
                />
                <Table.ScrollContainer
                    minWidth={variant === "relation" ? 820 : 700}
                    h="min(400px, 50dvh)"
                >
                    <Table
                        data-testid="advanced-search-results"
                        horizontalSpacing="xs"
                        verticalSpacing="xs"
                        layout="fixed"
                        highlightOnHover
                        highlightOnHoverColor="var(--mantine-color-default-hover)"
                        stickyHeader
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Th
                                    sorted={sortField === "type"}
                                    reversed={sortReversed}
                                    onSort={() => setSorting("type")}
                                >
                                    Type
                                </Th>
                                <Th
                                    sorted={sortField === "id"}
                                    reversed={sortReversed}
                                    onSort={() => setSorting("id")}
                                >
                                    ID
                                </Th>
                                {variant === "relation" ? (
                                    <>
                                        <Th
                                            sorted={sortField === "category"}
                                            reversed={sortReversed}
                                            onSort={() => setSorting("category")}
                                        >
                                            Category
                                        </Th>
                                        <Th
                                            sorted={sortField === "components"}
                                            reversed={sortReversed}
                                            onSort={() => setSorting("components")}
                                        >
                                            Components
                                        </Th>
                                        <Th
                                            sorted={sortField === "ordered"}
                                            reversed={sortReversed}
                                            onSort={() => setSorting("ordered")}
                                        >
                                            Ordered / Unordered
                                        </Th>
                                    </>
                                ) : (
                                    <>
                                        <Th
                                            sorted={sortField === "children"}
                                            reversed={sortReversed}
                                            onSort={() => setSorting("children")}
                                        >
                                            Children
                                        </Th>
                                        <Th
                                            sorted={sortField === "relations"}
                                            reversed={sortReversed}
                                            onSort={() => setSorting("relations")}
                                        >
                                            Relations
                                        </Th>
                                    </>
                                )}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
                <Group justify="center">
                    <Pagination
                        size="sm"
                        total={totalPages}
                        value={activePage}
                        onChange={setPage}
                    />
                </Group>
            </Stack>
        </Modal>
    );
}
