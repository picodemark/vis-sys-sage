import { ImportError } from "@/errors/ImportError.ts";
import type { StoredSystemDataFiles, SystemDataFiles, SystemDataType } from "@/types/system.ts";

const SYSTEM_DATA_FORM_FIELDS: Record<SystemDataType, string> = {
    hwloc: "hwloc",
    cccbench: "cccbench",
    "caps-numa": "caps_numa",
    iqm: "iqm",
};

export function restoreSystemDataFiles(storedFiles: StoredSystemDataFiles): SystemDataFiles {
    return Object.fromEntries(
        Object.entries(storedFiles).map(([type, file]) => [
            type,
            new File([file.content], file.name, { type: file.mimeType }),
        ]),
    ) as SystemDataFiles;
}

export async function storeSystemDataFiles(files: SystemDataFiles): Promise<StoredSystemDataFiles> {
    const entries = await Promise.all(
        (Object.entries(files) as Array<[SystemDataType, File]>).map(
            async ([type, file]) =>
                [
                    type,
                    {
                        name: file.name,
                        mimeType: file.type,
                        content: await file.text(),
                    },
                ] as const,
        ),
    );

    return Object.fromEntries(entries) as StoredSystemDataFiles;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

async function requestText(input: string, init: RequestInit, fallback: string) {
    const response = await fetch(input, init);

    if (!response.ok) {
        const body: unknown = await response.json().catch(() => undefined);
        const detail = isRecord(body) && typeof body.detail === "string" ? body.detail.trim() : "";
        throw new ImportError(detail || fallback);
    }

    return response.text();
}

export async function loadExample(exampleId: string): Promise<string> {
    return requestText(
        `/api/data/examples/${encodeURIComponent(exampleId)}`,
        { cache: "no-store" },
        "The example import failed.",
    );
}

export async function loadSystemData(files: SystemDataFiles): Promise<string> {
    const form = new FormData();
    for (const [type, file] of Object.entries(files) as Array<[SystemDataType, File]>) {
        form.append(SYSTEM_DATA_FORM_FIELDS[type], file);
    }

    return requestText(
        "/api/data/parse",
        {
            method: "POST",
            body: form,
        },
        "The system data import failed.",
    );
}
