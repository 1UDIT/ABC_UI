import { useCallback, useState } from "react";

type UseRowMultiSelectionProps<TData> = {
    rows: TData[];
    getRowId: (row: TData, index: number) => string;
};

export function useRowMultiSelection<TData>({
    rows,
    getRowId,
}: UseRowMultiSelectionProps<TData>) {
    const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
        null
    );

    const clearSelection = useCallback(() => {
        setSelectedRowIds(new Set());
        setLastSelectedIndex(null);
    }, []);

    const isRowSelected = useCallback(
        (rowId: string) => {
            return selectedRowIds.has(rowId);
        },
        [selectedRowIds]
    );

    const getSelectedRows = useCallback(() => {
        return rows.filter((row, index) => selectedRowIds.has(getRowId(row, index)));
    }, [rows, selectedRowIds, getRowId]);

    const handleRowSelection = useCallback(
        (
            event: React.MouseEvent<HTMLTableRowElement>,
            row: TData,
            rowIndex: number
        ) => {
            const rowId = getRowId(row, rowIndex);

            setSelectedRowIds((current) => {
                const next = new Set(current);

                const isCtrl = event.ctrlKey || event.metaKey;
                const isShift = event.shiftKey;

                if (isShift && lastSelectedIndex !== null) {
                    const start = Math.min(lastSelectedIndex, rowIndex);
                    const end = Math.max(lastSelectedIndex, rowIndex);

                    if (!isCtrl) {
                        next.clear();
                    }

                    for (let i = start; i <= end; i++) {
                        const rangeRow = rows[i];

                        if (rangeRow) {
                            next.add(getRowId(rangeRow, i));
                        }
                    }

                    return next;
                }

                if (isCtrl) {
                    if (next.has(rowId)) {
                        next.delete(rowId);
                    } else {
                        next.add(rowId);
                    }

                    return next;
                }

                next.clear();
                next.add(rowId);

                return next;
            });

            setLastSelectedIndex(rowIndex);
        },
        [rows, getRowId, lastSelectedIndex]
    );

    return {
        selectedRowIds,
        selectedRowCount: selectedRowIds.size,
        isRowSelected,
        getSelectedRows,
        handleRowSelection,
        clearSelection,
    };
}