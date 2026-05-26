import { useEffect, useMemo, useRef, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
  type ColumnFiltersState,
  type ColumnDef,
  type OnChangeFn,
} from "@tanstack/react-table";

import { TableResizeHandle } from "@/Share/components/DynamicTable/TableResizeHandle";
import { DynamicTableFilter } from "./DynamicTableFilter";
import { TablePagination } from "./TablePagination";

type ColumnConfig = {
  accessorKey: string;
  header: string;
  type: "text" | "number" | "select" | "date";
  filter?: boolean;
  options?: string[];
  width?: number;
};

type TableConfig = {
  columns: ColumnConfig[];
}; 

type DynamicTableProps = {
  data: any[];
  rowCount: number;
  configUrl?: string;
  isLoading?: boolean;

  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;

  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;

  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
};

export function DynamicTable({
  data,
  rowCount,
  configUrl = "/config/migration-table-config.json",
  isLoading = false,
  pagination,
  onPaginationChange,
  columnFilters,
  onColumnFiltersChange,
  sorting,
  onSortingChange,
}: DynamicTableProps) {
  const [config, setConfig] = useState<TableConfig | null>(null);  

  const tableRef = useRef<HTMLTableElement | null>(null);

  useEffect(() => {
    fetch(configUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load table config");
        }

        return res.json();
      })
      .then((json: TableConfig) => {
        setConfig(json);
      })
      .catch((error) => {
        console.error("Table config error:", error);
      });
  }, [configUrl]);

  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (!config?.columns) return [];

    return config.columns.map((col) => ({
      accessorKey: col.accessorKey,
      header: col.header,
      size: col.width ?? 180,
      minSize: 80,
      maxSize: 600,

      cell: ({ getValue }) => {
        const value = getValue();

        if (isLoading) {
          return <div className="h-4 w-24 animate-pulse rounded bg-slate-600" />;
        }

        if (value === null || value === undefined || value === "") {
          return "-";
        }

        if (col.type === "number") {
          return Number(value).toLocaleString();
        }

        return String(value);
      },

      filterFn: (row, columnId, filterValue) => {
        const rowValue = row.getValue(columnId);

        if (!filterValue) return true;

        if (col.type === "select") {
          return rowValue === filterValue;
        }

        if (col.type === "number") {
          return String(rowValue).includes(String(filterValue));
        }

        if (col.type === "date") {
          return String(rowValue).startsWith(String(filterValue));
        }

        return String(rowValue ?? "")
          .toLowerCase()
          .includes(String(filterValue).toLowerCase());
      },
    }));
  }, [config, isLoading]);

  const tableData = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: pagination.pageSize }, () => ({}));
    }

    return data ?? [];
  }, [isLoading, data, pagination.pageSize]);

  const table = useReactTable({
    data: tableData,
    columns,

    state: {
      columnFilters,
      sorting,
      pagination,
    },

    columnResizeMode: "onChange",

    onColumnFiltersChange: onColumnFiltersChange,
    onSortingChange: onSortingChange,
    onPaginationChange,

    manualPagination: true,
    rowCount,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!config) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-400">
        Loading table config...
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-slate-700 bg-slate-900 p-4">
      <div className="min-h-0 flex-1 overflow-auto">
        <table
          ref={tableRef}
          className="table-fixed border-collapse text-sm"
          style={{
            width: "100%",
            minWidth: `${table.getCenterTotalSize()}px`,
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-slate-700">
                {headerGroup.headers.map((header) => {
                  const columnConfig = config.columns.find(
                    (c) => c.accessorKey === header.column.id
                  );

                  return (
                    <th
                      key={header.id}
                      className="relative select-none whitespace-nowrap border-r border-slate-800 px-3 py-3 text-left font-semibold text-slate-200"
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-2"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {{
                          asc: "▲",
                          desc: "▼",
                        }[header.column.getIsSorted() as string] ?? ""}
                      </button>

                      {columnConfig?.filter && (
                        <DynamicTableFilter
                          column={header.column}
                          filterType={columnConfig?.type}
                        />
                      )}
                      <TableResizeHandle header={header} />
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`font-medium h-7" odd:bg-[#24303f] even:bg-[#2d3d52] text-white`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="whitespace-nowrap px-3 py-3 text-slate-100"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-8 text-center text-slate-400"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <TablePagination table={table} />
    </div>
  );
}