import { Button, Group, Select } from "@mantine/core";

interface ExampleOption {
    value: string;
    label: string;
}

interface ExampleSelectionProps {
    options: ExampleOption[];
    value: string;
    selectTestId: string;
    buttonTestId: string;
    buttonLabel: string;
    loading: boolean;
    onChange: (value: string) => void;
    onAction: () => void;
}

export function ExampleSelection({
    options,
    value,
    selectTestId,
    buttonTestId,
    buttonLabel,
    loading,
    onChange,
    onAction,
}: ExampleSelectionProps) {
    return (
        <Group
            align="flex-end"
            wrap="wrap"
        >
            <Select
                data-testid={selectTestId}
                label="Example data"
                data={options}
                value={value}
                allowDeselect={false}
                flex={1}
                miw={220}
                onChange={(nextValue) => nextValue !== null && onChange(nextValue)}
            />
            <Button
                data-testid={buttonTestId}
                loading={loading}
                w={{ base: "100%", sm: "auto" }}
                onClick={onAction}
            >
                {buttonLabel}
            </Button>
        </Group>
    );
}
