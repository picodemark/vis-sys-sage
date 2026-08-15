import { useDebouncedValue } from "@mantine/hooks";
import { useMemo, useState } from "react";

const SEARCH_DEBOUNCE_MILLISECONDS = 200;

export function useSearch<T>(elements: T[], searchIndex: (element: T) => string) {
    const [searchText, setSearchText] = useState("");
    const [debouncedSearchText] = useDebouncedValue(searchText, SEARCH_DEBOUNCE_MILLISECONDS);

    const normalizedSearchText = debouncedSearchText.trim().toLowerCase();
    const searchIsEmpty = searchText.trim() === "";
    const foundElements = useMemo(
        () =>
            searchIsEmpty || normalizedSearchText === ""
                ? elements
                : elements.filter((entity) => searchIndex(entity).includes(normalizedSearchText)),
        [elements, normalizedSearchText, searchIndex, searchIsEmpty],
    );

    return {
        searchText,
        setSearchText,
        foundElements,
    };
}
