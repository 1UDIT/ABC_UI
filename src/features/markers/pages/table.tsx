import { useMemo, useState } from "react";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

import { DynamicTable } from "@/Share/components/DynamicTable/DynamicTable"; 
import { useMarkerData } from "../hooks/useMarkersData";

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

export default function MarkerPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const backendFilters = useMemo(
    () => columnFiltersToObject(columnFilters),
    [columnFilters]
  );

  const { data, isLoading, isError, error } = useMarkerData(
    pagination,
    sorting,
    backendFilters
  );

  if (isError) {
    return (
      <div className="flex h-[calc(100vh-24px)] items-center justify-center p-4 text-red-400">
        Failed to load data: {error.message}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-24px)] overflow-hidden p-4 pb-6">
      <DynamicTable
        data={data?.data ?? []}
        rowCount={data?.total ?? 0}
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
      />
    </div>
  );
}