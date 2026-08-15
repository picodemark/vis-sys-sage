import { Box, Group, Text } from "@mantine/core";
import type { ReactNode } from "react";

interface LegendItemProps {
    symbol: ReactNode;
    label: string;
}

export function LegendItem({ symbol, label }: LegendItemProps) {
    return (
        <Group
            gap={7}
            wrap="nowrap"
        >
            <Box
                w={30}
                h={16}
                style={{ flex: "0 0 auto" }}
            >
                {symbol}
            </Box>
            <Text size="xs">{label}</Text>
        </Group>
    );
}
