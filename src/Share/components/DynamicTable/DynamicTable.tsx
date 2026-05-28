import { useEffect, useMemo, useRef, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { TableResizeHandle } from "@/Share/components/DynamicTable/TableResizeHandle";
import { DynamicTableFilter } from "./DynamicTableFilter";
import { TablePagination } from "./TablePagination";
import { useRowKeyboardNavigation } from "@/Share/components/handleCellKeyDown";
import type { DynamicTableProps, TableConfig } from "./types";


export function DynamicTable({
  data,
  rowCount,
  configUrl = `${import.meta.env.BASE_URL}config/app-config.json`,
  columnKey,
  isLoading = false,
  pagination,
  onPaginationChange,
  columnFilters,
  onColumnFiltersChange,
  sorting,
  onSortingChange,
  onRowDoubleClick,
  displayMenu,
  navigationdisplay = true,
  removeFilters = false,
}: DynamicTableProps) {
  const [config, setConfig] = useState<TableConfig | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);


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


  const selectedColumns = useMemo(() => {
    if (!config) return [];
    return config[columnKey] ?? [];
  }, [config, columnKey]);

  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (!selectedColumns.length) return [];

    return selectedColumns.map((col) => ({
      accessorKey: col.accessorKey,
      header: col.header,
      size: col.size ?? col.width ?? 180,
      minSize: col.minSize ?? 80,
      maxSize: col.maxSize ?? 600,

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
    }));
  }, [selectedColumns, isLoading]);

  const tableData = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 10 }, (_, index) => ({
        id: `loading-${index}`,
      }));
    }

    return data ?? [];
  }, [isLoading, data, pagination.pageSize]);

  console.log("isloading:", isLoading)

  const table = useReactTable({
    data: tableData,
    columns,

    getRowId: (row, index) => String(row.id ?? index),

    state: {
      columnFilters,
      sorting,
      pagination,
    },

    columnResizeMode: "onChange",

    onColumnFiltersChange,
    onSortingChange,
    onPaginationChange,

    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,

    rowCount,

    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (isLoading) return;
    if (table.getRowModel().rows.length === 0) return;

    setSelectedRowIndex(0);

    window.setTimeout(() => {
      const firstRow = tableRef.current?.querySelector<HTMLTableRowElement>(
        `[data-row-index="0"]`
      );

      firstRow?.focus({ preventScroll: true });
    }, 100);
  }, [columnFilters, isLoading, table.getRowModel().rows.length]);

  useRowKeyboardNavigation({
    tableRef,
    autoFocusFirstRow: !isLoading && table.getRowModel().rows.length > 0,
    focusDependency: `${pagination.pageIndex}-${table.getRowModel().rows.length}`,
    setSelectedRowIndex,
    rowCount: table.getRowModel().rows.length,
    navigationDelay: 90,
  });


  if (!config) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-400">
        Loading table config...
      </div>
    );
  }

  return (
    <div className="flex h-full w-full min-w-0 flex-col rounded-2xl border border-slate-700 bg-slate-900 p-4">
      <div className="min-h-0 w-full flex-1 overflow-auto">
        <table
          ref={tableRef}
          className="table-fixed border-collapse text-sm"
          style={{
            width: "100%",
            minWidth: `${table.getCenterTotalSize()}px`,
          }}
        >
          <thead className="sticky top-0 z-10 bg-slate-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-slate-700">
                {headerGroup.headers.map((header) => {
                  const columnConfig = selectedColumns.find(
                    (c) => c.accessorKey === header.column.id
                  );

                  return (
                    <th
                      key={header.id}
                      className="relative select-none whitespace-nowrap border-r border-slate-800 px-3 py-3 text-left font-semibold text-slate-200"
                      style={{
                        width: `${header.getSize()}px`,
                      }}
                    >
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex w-full items-center gap-2 truncate"
                      >
                        <span className="truncate">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>

                        {{
                          asc: "▲",
                          desc: "▼",
                        }[header.column.getIsSorted() as string] ?? ""}
                      </button>

                      {columnConfig?.filter && !removeFilters && (
                        <DynamicTableFilter
                          column={header.column}
                          filterType={columnConfig.type}
                          options={columnConfig.options}
                          calendarMode={columnConfig.calendarMode}
                          numberOfMonths={columnConfig.numberOfMonths}
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
              table.getRowModel().rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  tabIndex={0}
                  data-row-index={rowIndex}
                  data-row-id={row.original?.id}
                  onClick={(e) => {
                    setSelectedRowIndex(rowIndex);
                    e.currentTarget.focus({ preventScroll: true });
                  }}
                  onDoubleClick={() => {
                    if (!onRowDoubleClick) return;
                    onRowDoubleClick(row.original);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (displayMenu) {
                      displayMenu(e, row.original);
                    }
                  }}
                  className={`h-7 font-medium  outline-none 
                               ${selectedRowIndex === rowIndex && navigationdisplay
                      ? "bg-[#e0cfb0] text-black"
                      : rowIndex % 2 === 0
                        ? "bg-[#24303f] text-white"
                        : "bg-[#2d3d52] text-white"
                    }
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="whitespace-nowrap border-r border-slate-800 px-3 py-2"
                      style={{
                        width: `${cell.column.getSize()}px`,
                      }}
                    >
                      <div className="truncate" title={String(cell.getValue())}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
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