import { MantineProvider } from "@mantine/core";
import type { ReactNode } from "react";
import { theme } from "@/theme.ts";

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    return (
        <MantineProvider
            theme={theme}
            defaultColorScheme="auto"
        >
            {children}
        </MantineProvider>
    );
}
