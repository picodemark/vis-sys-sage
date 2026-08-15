export type SystemDataType = "hwloc" | "cccbench" | "caps-numa" | "iqm";

export type SystemDataFiles = Partial<Record<SystemDataType, File>>;

export interface StoredSystemDataFile {
    name: string;
    mimeType: string;
    content: string;
}

export type StoredSystemDataFiles = Partial<Record<SystemDataType, StoredSystemDataFile>>;
