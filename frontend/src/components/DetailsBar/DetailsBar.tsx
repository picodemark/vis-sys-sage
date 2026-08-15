import {
    Accordion,
    AppShell,
    Badge,
    Button,
    Divider,
    Group,
    ScrollArea,
    Stack,
    Text,
} from "@mantine/core";
import { IconArrowLeft, IconLink, IconTags } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { AttributesTable } from "@/components/Attributes/AttributesTable.tsx";
import { ComponentDetails } from "@/components/ComponentDetails/ComponentDetails.tsx";
import { DetailsTitle } from "@/components/DetailsTitle/DetailsTitle.tsx";
import { ListElement } from "@/components/ListElement/ListElement.tsx";
import { RelationDetails } from "@/components/RelationDetails/RelationDetails.tsx";
import {
    useComponentHistory,
    useGraph,
    useGraphActions,
    useSelectedComponent,
    useSelectedRelation,
} from "@/store/graph/selectors.ts";
import type { Component } from "@/types/component.ts";
import type { Relation } from "@/types/relation.ts";
import { groupRelationsForDisplay } from "@/util/relation.ts";

function getRelationComponents(componentUids: number[], componentsByUid: Map<number, Component>) {
    const occurrences = new Map<number, number>();

    return componentUids.flatMap((uid, index) => {
        const component = componentsByUid.get(uid);
        if (component === undefined) {
            return [];
        }

        const occurrence = occurrences.get(uid) ?? 0;
        occurrences.set(uid, occurrence + 1);

        return [
            {
                key: `${uid}-${occurrence}`,
                position: index + 1,
                component,
            },
        ];
    });
}

function getRelationPair(
    pairUids: [string, string] | undefined,
    relations: Map<string, Relation>,
): [Relation, Relation] | undefined {
    if (pairUids === undefined) {
        return undefined;
    }

    const first = relations.get(pairUids[0]);
    const second = relations.get(pairUids[1]);
    return first === undefined || second === undefined ? undefined : [first, second];
}

export function DetailsBar() {
    const graph = useGraph();
    const componentHistory = useComponentHistory();
    const selectedComponent = useSelectedComponent();
    const selectedRelation = useSelectedRelation();
    const { setSelectedComponent, setSelectedRelationUid } = useGraphActions();
    const lastSelectedComponent = componentHistory.at(-1);

    const [value, setValue] = useState<string[]>([]);

    const attributes = selectedRelation?.attributes ?? selectedComponent?.attributes ?? {};
    const numberAttributes = Object.keys(attributes).length;

    const componentRelations =
        selectedRelation === undefined
            ? groupRelationsForDisplay(
                  selectedComponent?.relations.flatMap((uid) => {
                      const relation = graph.relations.get(uid);
                      return relation === undefined ? [] : [relation];
                  }) ?? [],
              )
            : [];
    const relationComponents =
        selectedRelation === undefined
            ? []
            : getRelationComponents(selectedRelation.componentUids, graph.componentsByUid);
    const relatedCount =
        selectedRelation === undefined ? componentRelations.length : relationComponents.length;
    const relatedLabel = selectedRelation === undefined ? "RELATIONS" : "COMPONENTS";
    const selfRelationPairUids =
        selectedRelation === undefined
            ? undefined
            : graph.selfRelationPairByUid.get(selectedRelation.uid);
    const selfRelationPair = getRelationPair(selfRelationPairUids, graph.relations);

    useEffect(() => {
        setValue([
            ...(numberAttributes > 0 ? ["attributes"] : []),
            ...(relatedCount > 0 ? ["related"] : []),
        ]);
    }, [numberAttributes, relatedCount]);

    return (
        <ScrollArea
            h="100%"
            data-testid={selectedRelation === undefined ? "component-details" : "relation-details"}
        >
            <AppShell.Section
                px="xs"
                pt="xs"
                pb="sm"
            >
                <Stack gap="sm">
                    <Group
                        justify="space-between"
                        align="center"
                        wrap="nowrap"
                    >
                        <DetailsTitle
                            variant={selectedRelation === undefined ? "component" : "relation"}
                        />
                        {selectedRelation !== undefined && lastSelectedComponent !== undefined && (
                            <Button
                                data-testid="back-to-node"
                                variant="subtle"
                                size="compact-xs"
                                leftSection={<IconArrowLeft size={14} />}
                                onClick={() => setSelectedComponent(lastSelectedComponent)}
                            >
                                Back to node
                            </Button>
                        )}
                    </Group>
                    {selectedRelation !== undefined ? (
                        <RelationDetails
                            relation={selectedRelation}
                            owner={
                                selectedRelation.ownerUid === undefined
                                    ? undefined
                                    : graph.componentsByUid.get(selectedRelation.ownerUid)
                            }
                            selfRelationPair={selfRelationPair}
                            onSelectRelation={setSelectedRelationUid}
                        />
                    ) : selectedComponent !== undefined ? (
                        <ComponentDetails component={selectedComponent} />
                    ) : null}
                </Stack>
            </AppShell.Section>
            <Divider />
            <AppShell.Section>
                <Accordion
                    order={5}
                    value={value}
                    onChange={setValue}
                    multiple
                >
                    <Accordion.Item
                        key="attributes"
                        value="attributes"
                    >
                        <Accordion.Control disabled={numberAttributes === 0}>
                            <Group gap={6}>
                                <IconTags
                                    size={14}
                                    stroke={1.8}
                                    aria-hidden
                                />
                                <Text
                                    size="xs"
                                    fw={700}
                                    c="dimmed"
                                >
                                    ATTRIBUTES
                                </Text>
                                <Badge
                                    variant="outline"
                                    size="xs"
                                    color="grey"
                                >
                                    {numberAttributes}
                                </Badge>
                            </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <ScrollArea>
                                <AttributesTable attributes={attributes} />
                            </ScrollArea>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item
                        key="related"
                        value="related"
                    >
                        <Accordion.Control disabled={relatedCount === 0}>
                            <Group gap={6}>
                                {relatedLabel === "RELATIONS" && (
                                    <IconLink
                                        size={14}
                                        stroke={1.8}
                                        aria-hidden
                                    />
                                )}
                                <Text
                                    size="xs"
                                    fw={700}
                                    c="dimmed"
                                >
                                    {relatedLabel}
                                </Text>
                                <Badge
                                    variant="outline"
                                    size="xs"
                                    color="grey"
                                >
                                    {relatedCount}
                                </Badge>
                            </Group>
                        </Accordion.Control>
                        <Accordion.Panel p={0}>
                            <ScrollArea>
                                {selectedRelation === undefined
                                    ? componentRelations.map(([relation, pairedRelation]) => (
                                          <ListElement
                                              key={`${relation.uid}:${pairedRelation?.uid ?? ""}`}
                                              variant="relation"
                                              relation={relation}
                                              pairedRelation={pairedRelation}
                                          />
                                      ))
                                    : relationComponents.map(({ key, position, component }) => (
                                          <ListElement
                                              key={key}
                                              variant="component"
                                              display="compact"
                                              component={component}
                                              position={
                                                  selectedRelation.ordered ? position : undefined
                                              }
                                              referenceRootUid={selectedComponent?.rootUid}
                                          />
                                      ))}
                            </ScrollArea>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </AppShell.Section>
        </ScrollArea>
    );
}
