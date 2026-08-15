import { Stack, Table, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { type ChangeEvent, useMemo } from "react";
import { useSearch } from "@/hooks/useSearch.ts";
import type { Attributes, AttributeValue } from "@/types/attributes.ts";
import { formatAttributeValue } from "@/util/attribute.ts";

function format(value: AttributeValue) {
    const structured = Array.isArray(value) || (typeof value === "object" && value !== null);

    return (
        <Text
            component="span"
            size="sm"
            ff={typeof value === "string" ? undefined : "monospace"}
            m={0}
            style={{ whiteSpace: structured ? "pre-wrap" : "normal", overflowWrap: "anywhere" }}
        >
            {formatAttributeValue(value, structured)}
        </Text>
    );
}

interface AttributesTableProps {
    attributes: Attributes;
}

function getAttributeSearchIndex([name, value]: [string, AttributeValue]) {
    return `${name} ${formatAttributeValue(value)}`.toLowerCase();
}

export function AttributesTable({ attributes }: AttributesTableProps) {
    const attributeList = useMemo(() => Object.entries(attributes), [attributes]);

    const { searchText, setSearchText, foundElements } = useSearch(
        attributeList,
        getAttributeSearchIndex,
    );

    function handleSearch(event: ChangeEvent<HTMLInputElement>) {
        setSearchText(event.currentTarget.value);
    }

    const rows = foundElements.map((attribute) => (
        <Table.Tr key={attribute[0]}>
            <Table.Td>
                <Text
                    size="sm"
                    c="dimmed"
                >
                    {attribute[0]}
                </Text>
            </Table.Td>
            <Table.Td>{format(attribute[1])}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Stack gap="xs">
            <TextInput
                data-testid="attribute-search"
                value={searchText}
                placeholder="Search attributes"
                aria-label="Search attributes"
                leftSection={<IconSearch size={14} />}
                onChange={handleSearch}
            />
            <Table
                layout="fixed"
                withRowBorders={false}
                highlightOnHover
            >
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Stack>
    );
}
