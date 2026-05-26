// src/shared/components/DynamicTable/DynamicTableFilter.tsx

import type { Column } from "@tanstack/react-table";
import type { FilterType } from "./types";

type Props<T> = {
  column: Column<T, unknown>;
  filterType?: FilterType;
  options?: string[];
};

export function DynamicTableFilter<T>({
  column,
  filterType = "text",
  options = [],
}: Props<T>) {
  const value = column.getFilterValue() ?? ""; 

  if (filterType === "none") return null;

  if (filterType === "select") {
    return (
      <select
        value={value as string}
        onChange={(e) => column.setFilterValue(e.target.value || undefined)}
        className="mt-2 w-full rounded-md border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-white"
      >
        <option value="">All</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    );
  }

  if (filterType === "number") {
    return (
      <input
        type="number"
        value={value as string}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder="Search..."
        className="mt-2 w-full rounded-md border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-white"
      />
    );
  }

  if (filterType === "date") {
    return (
      <input
        type="date"
        value={value as string}
        onChange={(e) => column.setFilterValue(e.target.value)}
        className="mt-2 w-full rounded-md border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-white"
      />
    );
  }

  return (
    <input
      type="text"
      value={value as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder="Search..."
      className="mt-2 w-full rounded-md border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-white"
    />
  );
}