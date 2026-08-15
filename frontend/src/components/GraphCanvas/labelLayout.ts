const COLLISION_GAP = 4;
const COLLISION_CELL_SIZE = 48;
const VIEWPORT_PADDING = 2;

interface LabelBounds {
    bottom: number;
    left: number;
    right: number;
    top: number;
}

interface LabelCandidate {
    bounds: LabelBounds;
    element: SVGTextElement;
    index: number;
    priority: number;
}

function labelsOverlap(left: LabelBounds, right: LabelBounds) {
    return (
        left.left < right.right + COLLISION_GAP &&
        left.right + COLLISION_GAP > right.left &&
        left.top < right.bottom + COLLISION_GAP &&
        left.bottom + COLLISION_GAP > right.top
    );
}

function isInsideViewport(bounds: LabelBounds, viewport: DOMRect) {
    return (
        bounds.left >= viewport.left + VIEWPORT_PADDING &&
        bounds.right <= viewport.right - VIEWPORT_PADDING &&
        bounds.top >= viewport.top + VIEWPORT_PADDING &&
        bounds.bottom <= viewport.bottom - VIEWPORT_PADDING
    );
}

function getCollisionCells(bounds: LabelBounds) {
    const minColumn = Math.floor((bounds.left - COLLISION_GAP) / COLLISION_CELL_SIZE);
    const maxColumn = Math.floor((bounds.right + COLLISION_GAP) / COLLISION_CELL_SIZE);
    const minRow = Math.floor((bounds.top - COLLISION_GAP) / COLLISION_CELL_SIZE);
    const maxRow = Math.floor((bounds.bottom + COLLISION_GAP) / COLLISION_CELL_SIZE);
    const cells: string[] = [];

    for (let row = minRow; row <= maxRow; row += 1) {
        for (let column = minColumn; column <= maxColumn; column += 1) {
            cells.push(`${column}:${row}`);
        }
    }

    return cells;
}

export function arrangeGraphLabels(svg: SVGSVGElement) {
    const labels = [...svg.querySelectorAll<SVGTextElement>("[data-graph-label]")];
    if (labels.length === 0) {
        return;
    }

    for (const label of labels) {
        label.style.visibility = "visible";
    }

    const candidates = labels
        .map<LabelCandidate>((element, index) => ({
            bounds: element.getBoundingClientRect(),
            element,
            index,
            priority: Number(element.dataset.graphLabelPriority ?? 0),
        }))
        .sort((left, right) => right.priority - left.priority || left.index - right.index);
    const viewport = svg.getBoundingClientRect();
    const acceptedByCell = new Map<string, LabelBounds[]>();

    for (const obstacle of svg.parentElement?.querySelectorAll<HTMLElement>(
        "[data-graph-label-obstacle]",
    ) ?? []) {
        const bounds = obstacle.getBoundingClientRect();
        for (const cell of getCollisionCells(bounds)) {
            const accepted = acceptedByCell.get(cell) ?? [];
            accepted.push(bounds);
            acceptedByCell.set(cell, accepted);
        }
    }

    for (const candidate of candidates) {
        const cells = getCollisionCells(candidate.bounds);
        const collides = cells.some((cell) =>
            acceptedByCell.get(cell)?.some((bounds) => labelsOverlap(candidate.bounds, bounds)),
        );
        const visible = isInsideViewport(candidate.bounds, viewport) && !collides;

        candidate.element.style.visibility = visible ? "visible" : "hidden";
        if (!visible) {
            continue;
        }

        for (const cell of cells) {
            const accepted = acceptedByCell.get(cell) ?? [];
            accepted.push(candidate.bounds);
            acceptedByCell.set(cell, accepted);
        }
    }
}
