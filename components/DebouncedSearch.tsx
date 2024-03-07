import { debounce } from "$std/async/debounce.ts";
import { useCallback, useEffect, useMemo } from "preact/hooks";

export default function DebouncedSearch({
    value,
    placeholder = "Search...",
    minCharacter = 0,
    disabled = false,
    onKeyUp,
    onLoading,
    onBeginSearching,
    onSearchChange,
    onFocus,
    onBlur
}: {
    value?: string,
    placeholder?: string,
    minCharacter?: number,
    disabled?: boolean,
    onKeyUp?: (e: Event) => void,
    onLoading: () => void,
    onBeginSearching: (q: string) => void,
    onSearchChange?: (value: string) => void,
    onFocus?: () => void,
    onBlur?: () => void
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

            if (onSearchChange) onSearchChange(q);
            if (q.length < minCharacter) return;
            onLoading();
            debouncedBeginSearching(q);
        }
    }

    return (
        <input
            disabled={disabled}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyUp={onKeyUp}
            value={value}
            onInput={handlers.searchChange}
            type="text" className="form-control" placeholder={placeholder}
        />
    );
}