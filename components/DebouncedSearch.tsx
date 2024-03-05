import { debounce } from "$std/async/debounce.ts";
import { StateUpdater, useCallback, useMemo } from "preact/hooks";

export default function DebouncedSearch({
    onLoading,
    onBeginSearching
}: {
    onLoading: () => void,
    onBeginSearching: (q: string) => void
}) {
    const beginSearching = useCallback((q: string) => {
        onBeginSearching(q);

        onLoading();
    }, []);

    const debouncedBeginSearching = useMemo(() => {
        return debounce(beginSearching, 300);
    }, [beginSearching]);

    const handlers = {
        searchChange(e) {
            const q = e.target.value;

            onLoading();
            debouncedBeginSearching(q);
        }
    }

    return (
        <input onInput={handlers.searchChange} type="text" className="form-control" placeholder="Search..." />
    );
}