import { debounce } from "$std/async/debounce.ts";
import { StateUpdater, useCallback, useMemo } from "preact/hooks";

export default function DebouncedSearch({
    setLoading,
    searchFunction
}: {
    setLoading: StateUpdater<boolean>,
    searchFunction: (q: string) => Promise<void>
}) {
    const beginSearching = useCallback(async (q: string) => {
        await searchFunction(q);

        setLoading(false);
    }, []);

    const debouncedBeginSearching = useMemo(() => {
        return debounce(beginSearching, 300);
    }, [beginSearching]);

    const handlers = {
        searchChange(e) {
            const q = e.target.value;

            setLoading(true);
            debouncedBeginSearching(q);
        }
    }

    return (
        <input onInput={handlers.searchChange} type="text" className="form-control" placeholder="Search..." />
    );
}