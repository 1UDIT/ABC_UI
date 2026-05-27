import React, { useEffect, useMemo, useState } from "react";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import type {
    ColumnFiltersState,
    PaginationState,
    SortingState,
} from "@tanstack/react-table";

import type { AssetData } from "../Type/AssetData";
import { useMarkersDialogData } from "../hooks/useMarkersDialog";
import { DynamicTable } from "@/Share/components/DynamicTable/DynamicTable";

type IndexPopupProps = {
    data: AssetData | null;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    openDialog: boolean;
};

function columnFiltersToObject(columnFilters: ColumnFiltersState) {
    return columnFilters.reduce<Record<string, unknown>>((acc, filter) => {
        if (
            filter.value !== undefined &&
            filter.value !== null &&
            String(filter.value).trim() !== ""
        ) {
            acc[filter.id] = filter.value;
        }

        return acc;
    }, {});
}

export default function IndexPopup({
    data,
    setOpenDialog,
    openDialog,
}: IndexPopupProps) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    });

    const [sorting, setSorting] = useState<SortingState>([]);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    useEffect(() => {
        const urn = data?.URN;

        if (!urn) return;

        setColumnFilters([
            {
                id: "URN",
                value: urn,
            },
        ]);

        setPagination((old) => ({
            ...old,
            pageIndex: 0,
        }));
    }, [data?.URN]);

    const backendFilters = useMemo(
        () => columnFiltersToObject(columnFilters),
        [columnFilters]
    );

    const {
        data: markerData,
        isLoading,
        isError,
        error,
    } = useMarkersDialogData(pagination, sorting, backendFilters);

    console.log("openDialog:", openDialog);

    return (
        <DialogContent
            className="md:h-[60vh] xl:h-[60vh] h-[45vh] bg-[#18202b] max-w-7xl md:block hidden   text-white"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={() => setOpenDialog(false)}
        >
            <DialogHeader>
                <DialogTitle className="text-white">
                    Marker Details
                </DialogTitle>

                <DialogDescription asChild className="h-15">

                    <div className="space-y-5 z-30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center content-center rounded-lg border border-gray-700 bg-[#111827] p-4">
                                <div className="text-sm text-gray-400">URN:</div>
                                <div className="mx-2 break-all font-medium text-white">{data?.URN ?? "-"}</div>
                            </div>
                            <div className="flex items-center content-center rounded-lg border border-gray-700 bg-[#111827] p-4">
                                <div className="text-sm text-gray-400">Asset Name:</div>
                                <div className="mx-2 break-all font-medium text-white">{data?.AssetName ?? "-"}</div>
                            </div>
                        </div>
                    </div>
                </DialogDescription>
            </DialogHeader>

            <div className="h-[calc(45vh-0px)] overflow-hidden pb-6">
                {isError ? (
                    <div className="flex h-full items-center justify-center text-red-400">
                        Failed to load marker data: {error.message}
                    </div>
                ) : (
                    <DynamicTable
                        data={markerData?.data ?? []}
                        rowCount={markerData?.total ?? 0}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        columnFilters={columnFilters}
                        onColumnFiltersChange={(updater) => {
                            setColumnFilters(updater);

                            setPagination((old) => ({
                                ...old,
                                pageIndex: 0,
                            }));
                        }}
                        sorting={sorting}
                        onSortingChange={(updater) => {
                            setSorting(updater);

                            setPagination((old) => ({
                                ...old,
                                pageIndex: 0,
                            }));
                        }}
                        configUrl="/config/app-config.json"
                        columnKey="markerColumns"
                        isLoading={isLoading}
                        navigationdisplay={false}
                        removeFilters={true}  
                    />
                )}
            </div>
        </DialogContent>
    );
}