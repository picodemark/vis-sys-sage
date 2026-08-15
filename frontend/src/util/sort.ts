export function sortByKey<T, K extends keyof T>(elements: T[], key: K, reversed = false) {
    return [...elements].sort((a, b) => {
        const sorted = a[key] === b[key] ? 0 : a[key] > b[key] ? 1 : -1;
        return reversed ? -sorted : sorted;
    });
}
