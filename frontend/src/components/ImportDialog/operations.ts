import { loadExample, loadSystemData, storeSystemDataFiles } from "@/api/data.ts";
import { MappingError } from "@/errors/MappingError.ts";
import { mapGraph } from "@/mapper/mapper.ts";
import { parseSysSageXml } from "@/mapper/xml.ts";
import type { SystemDataFiles } from "@/types/system.ts";
import {
    EXAMPLES,
    type ExampleId,
    SYSTEM_DATA_TYPES,
    SYSTEM_EXAMPLES,
    type SystemExampleId,
} from "./config.ts";

export async function loadJsonGraph(file: File) {
    try {
        const parsedJson: unknown = JSON.parse(await file.text());
        return { graph: mapGraph(parsedJson), filename: file.name };
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new MappingError("The selected file does not contain valid JSON.", {
                cause: error,
            });
        }

        throw error;
    }
}

export async function loadSystemGraph(files: SystemDataFiles) {
    const selectedFiles = SYSTEM_DATA_TYPES.flatMap((type) => {
        const file = files[type];
        return file === undefined ? [] : [file];
    });
    const [xml, storedFiles] = await Promise.all([
        loadSystemData(files),
        storeSystemDataFiles(files),
    ]);

    return {
        graph: mapGraph(parseSysSageXml(xml)),
        filename: selectedFiles.map((file) => file.name).join(" + "),
        storedFiles,
    };
}

export async function loadExampleGraph(exampleId: ExampleId) {
    const example = EXAMPLES[exampleId];
    const graph = mapGraph(parseSysSageXml(await loadExample(exampleId)));
    return { graph, filename: example.filename, label: example.label };
}

export async function loadSystemExampleFile(exampleId: SystemExampleId) {
    const example = SYSTEM_EXAMPLES[exampleId];
    const file = new File([await example.load()], example.filename, { type: "application/xml" });
    return { file, label: example.label };
}
