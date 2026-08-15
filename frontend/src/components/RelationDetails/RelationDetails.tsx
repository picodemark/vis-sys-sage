import { ActionIcon, Group, Stack, Text, Tooltip } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { TypeBadge } from "@/components/TypeBadge/TypeBadge.tsx";
import type { Component } from "@/types/component.ts";
import type { Relation } from "@/types/relation.ts";

interface RelationDetailsProps {
    relation: Relation;
    owner?: Component;
    selfRelationPair?: [Relation, Relation];
    onSelectRelation: (relationUid: string) => void;
}

export function RelationDetails({
    relation,
    owner,
    selfRelationPair,
    onSelectRelation,
}: RelationDetailsProps) {
    const selectedRecord = selfRelationPair?.findIndex(({ uid }) => uid === relation.uid) ?? -1;
    const otherRecord =
        selfRelationPair === undefined || selectedRecord < 0
            ? undefined
            : selfRelationPair[selectedRecord === 0 ? 1 : 0];

    return (
        <Group
            gap="xs"
            align="flex-start"
        >
            <TypeBadge
                variant="relation"
                type={relation.type}
            />
            <Stack gap={0}>
                <Text
                    size="sm"
                    fw={500}
                >
                    {relation.type}
                </Text>
                {selfRelationPair === undefined || otherRecord === undefined ? (
                    <Text
                        size="xs"
                        c="dimmed"
                        ff="monospace"
                    >
                        {`ID: ${relation.id}`}
                    </Text>
                ) : (
                    <Group
                        gap={4}
                        wrap="nowrap"
                    >
                        <Text
                            size="xs"
                            c={selectedRecord === 0 ? undefined : "dimmed"}
                            ff="monospace"
                            fw={selectedRecord === 0 ? 700 : 400}
                        >
                            ID: {selfRelationPair[0].id}
                        </Text>
                        <Tooltip
                            label={
                                `Show the other record on the opposite visual side ` +
                                `(ID ${otherRecord.id})`
                            }
                        >
                            <ActionIcon
                                variant="subtle"
                                size="sm"
                                aria-label={`Show the other self-relation record, ID ${otherRecord.id}`}
                                onClick={() => onSelectRelation(otherRecord.uid)}
                            >
                                {selectedRecord === 0 ? (
                                    <IconArrowRight size={14} />
                                ) : (
                                    <IconArrowLeft size={14} />
                                )}
                            </ActionIcon>
                        </Tooltip>
                        <Text
                            size="xs"
                            c={selectedRecord === 1 ? undefined : "dimmed"}
                            ff="monospace"
                            fw={selectedRecord === 1 ? 700 : 400}
                        >
                            ID: {selfRelationPair[1].id}
                        </Text>
                    </Group>
                )}
                <Text
                    size="xs"
                    c="dimmed"
                >
                    Category {relation.category} · {relation.ordered ? "Ordered" : "Unordered"}
                </Text>
                {owner !== undefined && (
                    <Text
                        size="xs"
                        c="dimmed"
                    >
                        Owned by {owner.type} ID {owner.id}
                    </Text>
                )}
            </Stack>
        </Group>
    );
}
