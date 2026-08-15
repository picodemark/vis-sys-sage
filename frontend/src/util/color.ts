const GOLDEN_ANGLE = 137.508;
const SATURATION = 70;
const LIGHTNESS = 50;

function hash(text: string) {
    let hash = 0;

    for (let index = 0; index < text.length; index++) {
        hash = (text.charCodeAt(index) + 31 * hash) >>> 0;
    }

    return hash;
}

export function getNextColor(text: string) {
    const hue = (GOLDEN_ANGLE * hash(text)) % 360;
    return `hsl(${hue.toFixed(1)}, ${SATURATION}%, ${LIGHTNESS}%)`;
}
