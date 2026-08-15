import { Badge, Group, NavLink, Text, Tooltip } from "@mantine/core";
import { RelationOrder } from "@/components/RelationOrder/RelationOrder.tsx";
import { TypeBadge } from "@/components/TypeBadge/TypeBadge.tsx";
import { useGraphActions, useIsSelectedComponent } from "@/store/graph/selectors.ts";
import type { Component } from "@/types/component.ts";
import type { Relation } from "@/types/relation.ts";

interface ComponentVariantProps {
    variant: "component";
    display: "compact" | "metadata";
    component: Component;
    position?: number;
    referenceRootUid?: number;
    onSelect?: (component: Component) => void;
    testId?: string;
}

interface RelationVariantProps {
    variant: "relation";
    relation: Relation;
    pairedRelation?: Relation;
    testId?: string;
}

type ListElementProps = ComponentVariantProps | RelationVariantProps;

export function ListElement(props: ListElementProps) {
    const { variant } = props;
    const selected = useIsSelectedComponent(
        variant === "component" ? props.component.uid : undefined,
    );
    const { setSelectedComponent, setSelectedRelationUid } = useGraphActions();

    if (variant === "relation") {
        const { pairedRelation, relation, testId } = props;

        return (
            <NavLink
                data-testid={testId ?? `relation-list-${relation.uid}`}
                label={
                    <Text
                        size="sm"
                        fw={500}
                    >
                        {relation.type}
                    </Text>
                }
                description={
                    <>
                        <Text
                            size="xs"
                            c="dimmed"
                            ff="monospace"
                            truncate
                        >
                            ID: {relation.id}
                        </Text>
                        <Text
                            size="xs"
                            c="dimmed"
                            ff="monospace"
                        >
                            Category: {relation.category} ·{` `}
                            {relation.ordered ? "Ordered" : "Unordered"}
                            {pairedRelation === undefined ? "" : " · 2 distinct records"}
                        </Text>
                    </>
                }
                leftSection={
                    <TypeBadge
                        variant="relation"
                        type={relation.type}
                    />
                }
                onClick={() => setSelectedRelationUid(relation.uid)}
            />
        );
    }

    const { component, display, position, referenceRootUid, onSelect, testId } = props;
    const sameTree =
        referenceRootUid === undefined ? undefined : component.rootUid === referenceRootUid;

    return (
        <NavLink
            data-testid={testId ?? `component-list-${component.uid}`}
            label={
                <Text
                    size="sm"
                    fw={500}
                >
                    {component.type}
                </Text>
            }
            description={
                <>
                    <Text
                        size="xs"
                        c="dimmed"
                        ff="monospace"
                        truncate
                    >
                        ID: {component.id}
                    </Text>
                    {display === "metadata" && (
                        <Text
                            size="xs"
                            c="dimmed"
                            ff="monospace"
                        >
                            Children: {component.children?.length ?? 0} · Relations:{" "}
                            {component.relations.length}
                        </Text>
                    )}
                </>
            }
            leftSection={
                <TypeBadge
                    variant="component"
                    type={component.type}
                />
            }
            rightSection={
                position === undefined && sameTree === undefined ? undefined : (
                    <Group gap={4}>
                        {sameTree !== undefined && (
                            <Tooltip label={`Root UID: ${component.rootUid}`}>
                                <Badge
                                    variant="light"
                                    size="sm"
                                    color={sameTree ? "blue" : "gray"}
                                >
                                    {sameTree ? "Same tree" : "Other tree"}
                                </Badge>
                            </Tooltip>
                        )}
                        {position !== undefined && <RelationOrder position={position} />}
                    </Group>
                )
            }
            active={selected}
            onClick={() => (onSelect ?? setSelectedComponent)(component)}
        />
    );
}
