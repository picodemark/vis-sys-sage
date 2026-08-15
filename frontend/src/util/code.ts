function getCamelCaseCandidates(text: string) {
    if (!/[a-z][A-Z]/.test(text)) {
        return [];
    }

    const words = text.split(/(?=[A-Z])/);
    const lastWord = words.pop()?.toUpperCase() ?? "";
    const prefix = words
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    return [...lastWord].map((letter) => `${prefix}${letter}`);
}

export function getNextCode(text: string, codes: string[], preferCamelCase = false) {
    const upperText = text.toUpperCase();
    const usedCodes = new Set(codes.map((code) => code.toUpperCase()));
    const candidates = preferCamelCase ? getCamelCaseCandidates(text) : [];

    for (let index = 0; index < upperText.length - 1; index++) {
        candidates.push(upperText.slice(index, index + 2));
    }
    candidates.push(upperText || "X");

    const availableCode = candidates.find((candidate) => !usedCodes.has(candidate));

    if (availableCode !== undefined) {
        return availableCode;
    }

    const baseCode = candidates[0] ?? "X";
    let suffix = 2;
    while (usedCodes.has(`${baseCode}${suffix}`)) {
        suffix += 1;
    }
    return `${baseCode}${suffix}`;
}
