import { MappingError } from "@/errors/MappingError.ts";
import { finalizeGraph } from "@/mapper/finalize.ts";
import type { Attributes, AttributeValue } from "@/types/attributes.ts";
import type { Component } from "@/types/component.ts";
import type { GraphData } from "@/types/graph.ts";
import type { SysSageNode, SysSageRelation } from "@/types/import.ts";
import type { Relation } from "@/types/relation.ts";
import { getNextCode } from "@/util/code.ts";
import { getNextColor } from "@/util/color.ts";

const TOPOLOGY_SYS_SAGE_NODE = "Topology";
const HIDDEN_COMPONENT_ATTRIBUTES = new Set(["parent"]);

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSafeInteger(value: unknown): value is number {
    return typeof value === "number" && Number.isSafeInteger(value);
}

function isAttributeValue(value: unknown): value is AttributeValue {
    if (
        value === null ||
        typeof value === "string" ||
        typeof value === "boolean" ||
        (typeof value === "number" && Number.isFinite(value))
    ) {
        return true;
    }

    if (Array.isArray(value)) {
        return value.every(isAttributeValue);
    }

    return isRecord(value) && Object.values(value).every(isAttributeValue);
}

function getAttributes(
    attributes: Record<string, unknown>,
    excludedKeys = new Set<string>(),
): Attributes {
    return Object.fromEntries(
        Object.entries(attributes).filter(
            (attribute): attribute is [string, AttributeValue] =>
                !excludedKeys.has(attribute[0]) && isAttributeValue(attribute[1]),
        ),
    );
}

function parseNode(
    value: unknown,
    location: string,
    seenAddresses = new Set<number>(),
): SysSageNode {
    if (!isRecord(value)) {
        throw new MappingError(`${location} must be an object.`);
    }

    const { address, id, type, children } = value;
    if (!isSafeInteger(address)) {
        throw new MappingError(`${location}.address must be a safe integer.`);
    }
    if (seenAddresses.has(address)) {
        throw new MappingError(`${location}.address duplicates component address ${address}.`);
    }
    seenAddresses.add(address);
    if (!isSafeInteger(id)) {
        throw new MappingError(`${location}.id must be a safe integer.`);
    }
    if (typeof type !== "string" || type.length === 0) {
        throw new MappingError(`${location}.type must be a non-empty string.`);
    }
    if (children !== undefined && !Array.isArray(children)) {
        throw new MappingError(`${location}.children must be an array when present.`);
    }

    const parsedChildren = children?.map((child, index) =>
        parseNode(child, `${location}.children[${index}]`, seenAddresses),
    );

    return {
        ...value,
        address,
        id,
        type,
        ...(parsedChildren === undefined ? {} : { children: parsedChildren }),
    };
}

function parseRelation(value: unknown, location: string): SysSageRelation {
    if (!isRecord(value)) {
        throw new MappingError(`${location} must be an object.`);
    }

    const { id, type, category, components, owner, ordered } = value;
    if (!isSafeInteger(id)) {
        throw new MappingError(`${location}.id must be a safe integer.`);
    }
    if (typeof type !== "string" || type.length === 0) {
        throw new MappingError(`${location}.type must be a non-empty string.`);
    }
    if (!isSafeInteger(category)) {
        throw new MappingError(`${location}.category must be a safe integer.`);
    }
    if (!Array.isArray(components) || !components.every(isSafeInteger)) {
        throw new MappingError(`${location}.components must be an array of safe integers.`);
    }
    if (owner !== undefined && !isSafeInteger(owner)) {
        throw new MappingError(`${location}.owner must be a safe integer when present.`);
    }
    if (typeof ordered !== "boolean") {
        throw new MappingError(`${location}.ordered must be a boolean.`);
    }

    return {
        ...value,
        id,
        type,
        category,
        components,
        ...(owner === undefined ? {} : { owner }),
        ordered,
    };
}

function ensureComponentView(type: string, graph: GraphData) {
    if (type in graph.componentViews) {
        return;
    }

    graph.componentViews[type] = {
        code: getNextCode(
            type,
            Object.values(graph.componentViews).map((view) => view.code),
        ),
        color: getNextColor(type),
    };
}

function visitNodes(
    sysSageNodes: SysSageNode[],
    rootUid: number | null,
    parentUid: number | null,
    graph: GraphData,
) {
    const components: Component[] = [];

    for (const sysSageNode of sysSageNodes) {
        components.push(visitNode(sysSageNode, rootUid, parentUid, graph));
    }

    return components;
}

function visitNode(
    sysSageNode: SysSageNode,
    rootUid: number | null,
    parentUid: number | null,
    graph: GraphData,
) {
    const { address, id, type, children, ...attributes } = sysSageNode;

    if (address !== undefined && id !== undefined && type !== undefined) {
        ensureComponentView(type, graph);

        const actualRootUid = rootUid ?? address;

        if (rootUid == null) {
            graph.rootIds.push(actualRootUid);
            graph.components.set(actualRootUid, new Map());
        }

        const presentChildren = Array.isArray(children) ? children : [];
        const actualChildren = visitNodes(presentChildren, actualRootUid, address, graph);

        const component: Component = {
            uid: address,
            id,
            type,
            rootUid: actualRootUid,
            parentUid,
            ...(actualChildren.length > 0
                ? { children: actualChildren.map((child) => child.uid) }
                : {}),
            relations: [],
            attributes: getAttributes(attributes, HIDDEN_COMPONENT_ATTRIBUTES),
            searchIndex: `${type} ${id}`.toLowerCase(),
        };

        graph.components.get(actualRootUid)?.set(component.uid, component);

        return component;
    } else {
        throw new MappingError("The component is missing required fields.");
    }
}

function mapComponentTree(sysSageNode: SysSageNode, graph: GraphData) {
    if (sysSageNode.type === TOPOLOGY_SYS_SAGE_NODE) {
        const { address, id, type, children, ...attributes } = sysSageNode;

        if (
            address !== undefined &&
            id !== undefined &&
            type !== undefined &&
            Array.isArray(children)
        ) {
            ensureComponentView(type, graph);
            const roots = visitNodes(children, null, null, graph);
            graph.topology = {
                uid: address,
                id,
                type: TOPOLOGY_SYS_SAGE_NODE,
                rootUid: address,
                parentUid: null,
                ...(roots.length > 0 ? { children: roots.map((root) => root.uid) } : {}),
                relations: [],
                attributes: getAttributes(attributes),
                searchIndex: `${TOPOLOGY_SYS_SAGE_NODE} ${id}`.toLowerCase(),
            };
        } else {
            throw new MappingError("The topology is missing required fields.");
        }
    } else {
        visitNode(sysSageNode, null, null, graph);
    }
}

function mapRelation(sysSageRelation: SysSageRelation) {
    const { id, type, category, components, owner, ordered, ...attributes } = sysSageRelation;

    const relation: Relation = {
        uid: crypto.randomUUID(),
        id,
        type,
        category,
        componentUids: components,
        ...(owner === undefined ? {} : { ownerUid: owner }),
        ordered,
        attributes: getAttributes(attributes),
        searchIndex: `${type} ${id}`.toLowerCase(),
    };

    return relation;
}

function mapRelations(sysSageRelations: SysSageRelation[], graph: GraphData) {
    const componentsByUid = new Map<number, Component>();
    for (const components of graph.components.values()) {
        for (const component of components.values()) {
            componentsByUid.set(component.uid, component);
        }
    }

    for (const sysSageRelation of sysSageRelations) {
        const relation = mapRelation(sysSageRelation);
        const missingComponentUids = [
            ...new Set(
                relation.componentUids.filter((componentUid) => !componentsByUid.has(componentUid)),
            ),
        ];

        if (missingComponentUids.length > 0) {
            throw new MappingError(
                `Relation ${relation.id} references unknown component address${
                    missingComponentUids.length === 1 ? "" : "es"
                }: ${missingComponentUids.join(", ")}.`,
            );
        }

        if (relation.ownerUid !== undefined && !componentsByUid.has(relation.ownerUid)) {
            throw new MappingError(
                `Relation ${relation.id} references unknown owner address ${relation.ownerUid}.`,
            );
        }

        if (!(relation.type in graph.relationViews)) {
            graph.relationViews[relation.type] = {
                code: getNextCode(
                    relation.type,
                    Object.values(graph.relationViews).map((view) => view.code),
                    true,
                ),
                color: getNextColor(relation.type),
            };
        }

        for (const componentUid of new Set(relation.componentUids)) {
            componentsByUid.get(componentUid)?.relations.push(relation.uid);
        }

        graph.relations.set(relation.uid, relation);
    }
}

export function mapGraph(input: unknown) {
    if (!isRecord(input)) {
        throw new MappingError("The imported data must contain an object at its root.");
    }

    const graph: GraphData = {
        rootIds: [],
        components: new Map(),
        componentViews: {},
        relations: new Map(),
        relationViews: {},
    };

    if (!("componentTree" in input)) {
        throw new MappingError("The imported data has no componentTree field.");
    }

    const componentTree = input.componentTree;
    if (componentTree !== null) {
        mapComponentTree(parseNode(componentTree, "componentTree"), graph);
    }

    const relationGraph = input.relationGraph;
    if (relationGraph !== undefined && relationGraph !== null) {
        if (!Array.isArray(relationGraph)) {
            throw new MappingError("relationGraph must be an array, null, or omitted.");
        }
        mapRelations(
            relationGraph.map((relation, index) =>
                parseRelation(relation, `relationGraph[${index}]`),
            ),
            graph,
        );
    }

    return finalizeGraph(graph);
}
