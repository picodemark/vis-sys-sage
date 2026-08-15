import { MappingError } from "@/errors/MappingError.ts";
import type { SysSageGraph, SysSageNode, SysSageRelation } from "@/types/import.ts";

const COMPONENT_REQUIRED_ATTRIBUTES = new Set(["addr", "address", "children", "id", "type"]);
const RELATION_REQUIRED_ATTRIBUTES = new Set([
    "category",
    "components",
    "id",
    "ordered",
    "owner",
    "type",
]);

function childElements(element: Element) {
    return Array.from(element.children);
}

function findAttribute(element: Element, ...names: string[]) {
    return Array.from(element.attributes).find((attribute) =>
        names.includes(attribute.localName.toLowerCase()),
    );
}

function findChild(element: Element, localName: string) {
    const normalizedName = localName.toLowerCase();
    return childElements(element).find((child) => child.localName.toLowerCase() === normalizedName);
}

function parseInteger(value: string | undefined, field: string) {
    const normalized = value?.trim();
    if (normalized === undefined || normalized === "") {
        throw new MappingError(`XML ${field} is missing.`);
    }

    const hexadecimal = normalized.match(/^([+-]?)(?:0x)([0-9a-f]+)$/i);
    const parsed =
        hexadecimal === null
            ? Number(normalized)
            : Number.parseInt(hexadecimal[2], 16) * (hexadecimal[1] === "-" ? -1 : 1);

    if (!Number.isSafeInteger(parsed)) {
        throw new MappingError(`XML ${field} must be a safe integer.`);
    }
    return parsed;
}

function parseBoolean(value: string | undefined, field: string) {
    const normalized = value?.trim().toLowerCase();
    if (normalized === "1" || normalized === "true") {
        return true;
    }
    if (normalized === "0" || normalized === "false") {
        return false;
    }
    throw new MappingError(`XML ${field} must be true, false, 1, or 0.`);
}

function collectAttributes(element: Element, requiredNames: Set<string>) {
    return Object.fromEntries(
        Array.from(element.attributes)
            .filter((attribute) => !requiredNames.has(attribute.localName.toLowerCase()))
            .map((attribute) => [attribute.name, attribute.value]),
    );
}

function hasComponentCoreField(element: Element) {
    return (
        findAttribute(element, "addr", "address") !== undefined ||
        findAttribute(element, "id") !== undefined
    );
}

function parseComponent(element: Element): SysSageNode {
    const address = findAttribute(element, "addr", "address")?.value;
    const id = findAttribute(element, "id")?.value;
    const children = childElements(element).filter(hasComponentCoreField).map(parseComponent);

    return {
        ...collectAttributes(element, COMPONENT_REQUIRED_ATTRIBUTES),
        address: parseInteger(address, `${element.localName} address`),
        id: parseInteger(id, `${element.localName} id`),
        type: element.localName,
        ...(children.length > 0 ? { children } : {}),
    };
}

function parseRelation(element: Element): SysSageRelation {
    const componentValue = findAttribute(element, "components")?.value.trim();
    const components =
        componentValue === undefined || componentValue.length === 0
            ? []
            : componentValue
                  .split(/[\s,;]+/)
                  .filter(Boolean)
                  .map((address) =>
                      parseInteger(address, `${element.localName} component address`),
                  );

    const category = findAttribute(element, "category")?.value;
    const id = findAttribute(element, "id")?.value;
    const ordered = findAttribute(element, "ordered")?.value;
    const owner = findAttribute(element, "owner")?.value;

    return {
        ...collectAttributes(element, RELATION_REQUIRED_ATTRIBUTES),
        id: parseInteger(id, `${element.localName} id`),
        type: element.localName,
        category:
            category === undefined ? 0 : parseInteger(category, `${element.localName} category`),
        components,
        ...(owner === undefined
            ? {}
            : { owner: parseInteger(owner, `${element.localName} owner address`) }),
        ordered: parseBoolean(ordered, `${element.localName} ordered`),
    };
}

export function parseSysSageXml(xml: string): SysSageGraph {
    const document = new DOMParser().parseFromString(xml, "application/xml");
    const parserError = Array.from(document.getElementsByTagName("*")).find(
        (element) => element.localName.toLowerCase() === "parsererror",
    );
    if (parserError !== undefined) {
        throw new MappingError("The server returned invalid XML.");
    }

    const componentsContainer = findChild(document.documentElement, "components");
    if (componentsContainer === undefined) {
        throw new MappingError("The XML has no Components section.");
    }

    const componentRoots = childElements(componentsContainer).filter(hasComponentCoreField);
    if (componentRoots.length !== 1) {
        throw new MappingError("The XML must contain exactly one component tree.");
    }

    const relationsContainer = findChild(document.documentElement, "relations");
    const relationGraph =
        relationsContainer === undefined
            ? []
            : childElements(relationsContainer)
                  .filter((element) =>
                      Array.from(element.attributes).some((attribute) =>
                          RELATION_REQUIRED_ATTRIBUTES.has(attribute.localName.toLowerCase()),
                      ),
                  )
                  .map(parseRelation);

    return {
        componentTree: parseComponent(componentRoots[0]),
        relationGraph,
    };
}
