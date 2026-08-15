import { ActionIcon, Box, Group } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { IconFocusCentered } from "@tabler/icons-react";
import * as d3 from "d3";
import type { ReactNode } from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import classes from "./GraphCanvas.module.css";
import { arrangeGraphLabels } from "./labelLayout.ts";
import type { GraphBounds } from "./types.ts";

const MIN_ZOOM = 0.005;
const MAX_ZOOM = 8;
const FIT_PADDING = 48;
const MIN_NODE_RADIUS = 1.5;
const MAX_NODE_RADIUS = 7;
const BASE_NODE_RADIUS = 4;
const NODE_STROKE_WIDTH = 1.5;
const NODE_HIT_RADIUS = 22;
interface CanvasSize {
    height: number;
    width: number;
}

let lastMeasuredCanvasSize: CanvasSize = { height: 0, width: 0 };

interface GraphCanvasProps {
    testId: "component-tree-graph" | "relation-graph";
    title: string;
    bounds: GraphBounds;
    labelZoomThreshold?: number;
    controls?: GraphCanvasControl[];
    legend?: ReactNode;
    children: (showLabels: boolean) => ReactNode;
}

interface GraphCanvasControl {
    label: string;
    icon: ReactNode;
    disabled?: boolean;
    onClick: () => void;
}

function updateLevelOfDetail(graph: SVGGElement, scale: number, labelZoomThreshold: number) {
    const screenRadius = Math.min(
        MAX_NODE_RADIUS,
        Math.max(MIN_NODE_RADIUS, BASE_NODE_RADIUS + Math.log2(scale)),
    );

    graph.style.setProperty("--graph-node-radius", `${screenRadius / scale}px`);
    graph.style.setProperty("--graph-overview-node-diameter", `${screenRadius * 2}px`);
    graph.style.setProperty("--graph-node-hit-radius", `${NODE_HIT_RADIUS / scale}px`);
    graph.style.setProperty("--graph-node-stroke-width", `${NODE_STROKE_WIDTH / scale}px`);
    graph.style.setProperty("--graph-inverse-scale", String(1 / scale));

    return scale >= labelZoomThreshold;
}

export function GraphCanvas({
    testId,
    title,
    bounds,
    labelZoomThreshold = 0.6,
    controls = [],
    legend,
    children,
}: GraphCanvasProps) {
    const { ref: containerRef, width, height } = useElementSize<HTMLDivElement>();
    const fallbackSizeRef = useRef(lastMeasuredCanvasSize);
    const canvasWidth = width > 0 ? width : fallbackSizeRef.current.width;
    const canvasHeight = height > 0 ? height : fallbackSizeRef.current.height;
    const svgRef = useRef<SVGSVGElement | null>(null);
    const graphRef = useRef<SVGGElement | null>(null);
    const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
    const labelLayoutFrameRef = useRef<number | undefined>(undefined);
    const showLabelsRef = useRef(false);
    const [showLabels, setShowLabels] = useState(false);

    const scheduleLabelLayout = useCallback(() => {
        if (labelLayoutFrameRef.current !== undefined) {
            cancelAnimationFrame(labelLayoutFrameRef.current);
        }

        labelLayoutFrameRef.current = requestAnimationFrame(() => {
            labelLayoutFrameRef.current = undefined;
            if (svgRef.current !== null) {
                arrangeGraphLabels(svgRef.current);
            }
        });
    }, []);

    const fitGraph = useCallback(() => {
        const svg = svgRef.current;
        const zoom = zoomRef.current;

        if (svg === null || zoom === null || canvasWidth <= 0 || canvasHeight <= 0) {
            return;
        }

        const graphWidth = Math.max(bounds.width, 1);
        const graphHeight = Math.max(bounds.height, 1);
        const availableWidth = Math.max(canvasWidth - FIT_PADDING * 2, 1);
        const availableHeight = Math.max(canvasHeight - FIT_PADDING * 2, 1);
        const scale = Math.min(
            MAX_ZOOM,
            Math.max(
                MIN_ZOOM,
                Math.min(availableWidth / graphWidth, availableHeight / graphHeight),
            ),
        );
        const centerX = bounds.x + graphWidth / 2;
        const centerY = bounds.y + graphHeight / 2;
        const transform = d3.zoomIdentity
            .translate(canvasWidth / 2, canvasHeight / 2)
            .scale(scale)
            .translate(-centerX, -centerY);

        d3.select(svg).call(zoom.transform, transform);
    }, [bounds.height, bounds.width, bounds.x, bounds.y, canvasHeight, canvasWidth]);

    useLayoutEffect(() => {
        if (width > 0 && height > 0) {
            lastMeasuredCanvasSize = { height, width };
            fallbackSizeRef.current = lastMeasuredCanvasSize;
        }
    }, [height, width]);

    useLayoutEffect(() => {
        const svg = svgRef.current;
        const graph = graphRef.current;

        if (svg === null || graph === null) {
            return;
        }

        const zoom = d3
            .zoom<SVGSVGElement, unknown>()
            .scaleExtent([MIN_ZOOM, MAX_ZOOM])
            .on("start", () => {
                svg.style.cursor = "grabbing";
            })
            .on("zoom", (event) => {
                graph.setAttribute("transform", String(event.transform));
                const nextShowLabels = updateLevelOfDetail(
                    graph,
                    event.transform.k,
                    labelZoomThreshold,
                );

                if (nextShowLabels !== showLabelsRef.current) {
                    showLabelsRef.current = nextShowLabels;
                    setShowLabels(nextShowLabels);
                }

                scheduleLabelLayout();
            })
            .on("end", () => {
                svg.style.cursor = "grab";
            });

        zoomRef.current = zoom;
        const selection = d3.select(svg);
        selection.call(zoom).on("dblclick.zoom", null);

        return () => {
            selection.on(".zoom", null);
            zoomRef.current = null;
        };
    }, [labelZoomThreshold, scheduleLabelLayout]);

    useLayoutEffect(() => {
        fitGraph();
    }, [fitGraph]);

    useLayoutEffect(() => {
        if (svgRef.current !== null) {
            arrangeGraphLabels(svgRef.current);
        }
    });

    useLayoutEffect(() => {
        return () => {
            if (labelLayoutFrameRef.current !== undefined) {
                cancelAnimationFrame(labelLayoutFrameRef.current);
                labelLayoutFrameRef.current = undefined;
            }
        };
    }, []);

    return (
        <Box
            data-testid={`${testId}-canvas`}
            ref={containerRef}
            className={classes.canvas}
        >
            <svg
                data-testid={testId}
                data-measured={canvasWidth > 0 && canvasHeight > 0}
                className={classes.canvasSvg}
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox={`0 0 ${Math.max(canvasWidth, 1)} ${Math.max(canvasHeight, 1)}`}
                role="img"
                aria-label={title}
            >
                <g
                    ref={graphRef}
                    className={classes.graph}
                >
                    {children(showLabels)}
                </g>
            </svg>

            <Group
                data-testid="graph-controls"
                data-graph-label-obstacle=""
                className={classes.controls}
                gap={4}
                p={4}
                bg="var(--mantine-color-body)"
            >
                {controls.map((control) => (
                    <ActionIcon
                        key={control.label}
                        size={44}
                        aria-label={control.label}
                        disabled={control.disabled}
                        onClick={control.onClick}
                    >
                        {control.icon}
                    </ActionIcon>
                ))}
                <ActionIcon
                    size={44}
                    aria-label="Fit graph"
                    onClick={fitGraph}
                >
                    <IconFocusCentered size={16} />
                </ActionIcon>
            </Group>

            {legend !== undefined && (
                <Box
                    data-graph-label-obstacle=""
                    className={classes.legend}
                >
                    {legend}
                </Box>
            )}
        </Box>
    );
}
