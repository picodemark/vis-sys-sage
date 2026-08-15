import { ComponentTree } from "@/components/ComponentTree/ComponentTree.tsx";
import type { Component } from "@/types/component.ts";
import type { Topology } from "@/types/topology.ts";

interface TopologyOverviewProps {
    topology: Topology;
    components: Map<number, Component>;
    componentsByUid: Map<number, Component>;
    onSelect: (component: Component) => void;
}

export function TopologyOverview({
    topology,
    components,
    componentsByUid,
    onSelect,
}: TopologyOverviewProps) {
    function handleSelect(component: Component) {
        const selected = componentsByUid.get(component.uid);
        if (selected !== undefined) {
            onSelect(selected);
        }
    }

    return (
        <ComponentTree
            variant="selection-only"
            root={topology}
            selectedComponent={topology}
            components={components}
            onSelect={handleSelect}
        />
    );
}
