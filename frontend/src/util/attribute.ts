import type { AttributeValue } from "@/types/attributes.ts";

export function formatAttributeValue(value: AttributeValue, pretty = false) {
    if (typeof value === "string") {
        return value;
    }

    if (value === null || typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }

    return JSON.stringify(value, null, pretty ? 2 : undefined) ?? "";
}
