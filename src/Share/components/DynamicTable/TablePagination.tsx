import type { Table } from "@tanstack/react-table";

type TablePaginationProps<TData> = {
  table: Table<TData>;
};

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
  return (
    <div className="mt-3 flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3 text-sm text-slate-300">
      <div className="flex items-center gap-2">
        <span>Rows per page</span>

        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-slate-200 outline-none"
        >
          {[10, 20, 30, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span>
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>

        <button
          type="button"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="rounded-md border border-slate-700 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {"<<"}
        </button>

        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded-md border border-slate-700 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded-md border border-slate-700 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>

        <button
          type="button"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className="rounded-md border border-slate-700 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {">>"}
        </button>
      </div>

      <div>
        Showing{" "}
        <strong>
          {table.getRowModel().rows.length}
        </strong>{" "}
        rows
      </div>
    </div>
  );
}