import {
    Accordion,
    ActionIcon,
    Button,
    Card,
    createTheme,
    Group,
    Paper,
    ScrollArea,
    Tooltip,
} from "@mantine/core";

export const theme = createTheme({
    primaryColor: "blue",

    defaultRadius: "md",
    autoContrast: true,
    cursorType: "pointer",

    components: {
        Accordion: Accordion.extend({
            styles: {
                content: { padding: "var(--mantine-spacing-xs)" },
                control: { paddingInline: "var(--mantine-spacing-xs)" },
                label: { paddingBlock: "var(--mantine-spacing-xs)" },
            },
        }),
        ActionIcon: ActionIcon.extend({
            defaultProps: { variant: "subtle", size: 36, color: "gray" },
        }),
        Button: Button.extend({ defaultProps: { variant: "default" } }),
        Card: Card.extend({ defaultProps: { withBorder: true } }),
        Group: Group.extend({ defaultProps: { wrap: "nowrap" } }),
        Paper: Paper.extend({ defaultProps: { withBorder: true } }),
        ScrollArea: ScrollArea.extend({ defaultProps: { scrollbarSize: 8 } }),
        Tooltip: Tooltip.extend({ defaultProps: { withArrow: true, openDelay: 8 } }),
    },
});
