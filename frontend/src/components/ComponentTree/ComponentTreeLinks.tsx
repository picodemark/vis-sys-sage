import type { TreeLayout, TreeRendering } from "./layout.ts";

interface ComponentTreeLinksProps {
    layout: TreeLayout;
    overviewRendering: boolean;
    rendering: TreeRendering;
}

export function ComponentTreeLinks({
    layout,
    overviewRendering,
    rendering,
}: ComponentTreeLinksProps) {
    return (
        <>
            <g
                fill="none"
                pointerEvents="none"
                stroke="var(--mantine-color-dimmed)"
                strokeOpacity={0.44}
            >
                {layout.depthRadii.map((depthRadius) => (
                    <circle
                        key={depthRadius}
                        data-depth-ring={depthRadius}
                        r={depthRadius}
                        strokeWidth={1.2}
                        vectorEffect="non-scaling-stroke"
                    />
                ))}
            </g>

            <g
                fill="none"
                stroke="var(--mantine-color-dimmed)"
                strokeOpacity={0.5}
                strokeLinecap="round"
            >
                {rendering.regularLinkPath !== "" && (
                    <path
                        d={rendering.regularLinkPath}
                        strokeWidth={1.1}
                        vectorEffect="non-scaling-stroke"
                    />
                )}
                {rendering.selectedLinkPath !== "" && (
                    <path
                        d={rendering.selectedLinkPath}
                        stroke="var(--mantine-primary-color-filled)"
                        strokeOpacity={0.9}
                        strokeWidth={2.4}
                        vectorEffect="non-scaling-stroke"
                    />
                )}
            </g>

            {overviewRendering && (
                <g
                    fill="none"
                    strokeLinecap="round"
                    strokeWidth="var(--graph-overview-node-diameter)"
                    vectorEffect="non-scaling-stroke"
                >
                    {rendering.overviewPaths.map(({ color, path }) => (
                        <path
                            key={color}
                            d={path}
                            stroke={color}
                        />
                    ))}
                </g>
            )}
        </>
    );
}
