import { IconFileTypeCsv, IconFileTypeXml, IconJson, type TablerIcon } from "@tabler/icons-react";
import type { SystemDataType } from "@/types/system.ts";

export const MAXIMUM_IMPORT_SIZE_MEBIBYTES = 20;
export const MAXIMUM_IMPORT_SIZE_BYTES = MAXIMUM_IMPORT_SIZE_MEBIBYTES * 1024 * 1024;

export const JSON_ACCEPTED_FILES = {
    "application/json": [".json"],
    "text/json": [".json"],
};

export const SYSTEM_DATA_INFO = {
    hwloc: {
        label: "hwloc",
        description: "hwloc XML",
        icon: IconFileTypeXml,
        accept: {
            "application/xml": [".xml"],
            "text/xml": [".xml"],
            "application/octet-stream": [".xml"],
        },
    },
    cccbench: {
        label: "CCCbench",
        description: "CCCbench CSV",
        icon: IconFileTypeCsv,
        accept: {
            "text/csv": [".csv"],
            "application/csv": [".csv"],
            "application/octet-stream": [".csv"],
        },
    },
    "caps-numa": {
        label: "CAPS NUMA",
        description: "CAPS NUMA CSV",
        icon: IconFileTypeCsv,
        accept: {
            "text/csv": [".csv"],
            "application/csv": [".csv"],
            "application/octet-stream": [".csv"],
        },
    },
    iqm: {
        label: "IQM",
        description: "IQM JSON",
        icon: IconJson,
        accept: {
            "application/json": [".json"],
            "text/json": [".json"],
            "application/octet-stream": [".json"],
        },
    },
} satisfies Record<
    SystemDataType,
    {
        label: string;
        description: string;
        icon: TablerIcon;
        accept: Record<string, string[]>;
    }
>;

export const SYSTEM_DATA_TYPES = Object.keys(SYSTEM_DATA_INFO) as SystemDataType[];

interface Example {
    label: string;
    description: string;
    filename: string;
}

export const EXAMPLES = {
    hpc: {
        label: "HPC · Skylake with CAPS NUMA",
        description:
            "Intel Xeon Silver 4116 topology created from source data with measured CAPS NUMA relations. It contains 106 components.",
        filename: "intel-xeon-silver-4116.xml",
    },
    qc: {
        label: "QC · 20-qubit LRZ IQM topology",
        description:
            "The 30 connections between the 20 qubits are transcribed from Figure 6 of the Sys-Sage paper. No direction is inferred.",
        filename: "lrz-iqm-20-qubit.xml",
    },
} satisfies Record<string, Example>;

export type ExampleId = keyof typeof EXAMPLES;

export const EXAMPLE_OPTIONS = Object.entries(EXAMPLES).map(([value, example]) => ({
    value,
    label: example.label,
}));

export const SYSTEM_EXAMPLES = {
    epyc9754: {
        label: "AMD EPYC 9754 · 1,318 components",
        description:
            "Real hwloc XML data for an HPE ProLiant DL365 Gen11 with two AMD EPYC 9754 processors and 1,318 components.",
        filename: "amd-epyc-9754-hwloc.xml",
        load: async () => (await import("@/data/examples/amd-epyc-9754-hwloc.xml?raw")).default,
    },
};

export type SystemExampleId = keyof typeof SYSTEM_EXAMPLES;

export const SYSTEM_EXAMPLE_OPTIONS = Object.entries(SYSTEM_EXAMPLES).map(([value, example]) => ({
    value,
    label: example.label,
}));
