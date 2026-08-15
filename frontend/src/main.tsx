import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/spotlight/styles.css";
import { App } from "@/components/App.tsx";
import { ThemeProvider } from "@/components/Theme/Theme.tsx";

const root = document.getElementById("root");

if (!root) {
    throw new Error("No root element present!");
}

createRoot(root).render(
    <StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </StrictMode>,
);
