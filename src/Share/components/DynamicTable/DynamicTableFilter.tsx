import { useEffect, useState } from "react";
import type { Column } from "@tanstack/react-table";
import type { FilterType } from "./types";
import { useDebounce } from "@/Share/hooks/useDebounce";

type Props<T> = {
  column: Column<T, unknown>;
  filterType?: FilterType;
  options?: string[];
  debounceDelay?: number;
};

export function DynamicTableFilter<T>({
  column,
  filterType = "text",
  options = [],
  debounceDelay = 700,
}: Props<T>) {
  const tableValue = column.getFilterValue() ?? "";
  const [inputValue, setInputValue] = useState(String(tableValue));

  const debouncedValue = useDebounce(inputValue, debounceDelay);
  const hasValue = String(inputValue).trim() !== "";

  useEffect(() => {
    setInputValue(String(tableValue));
  }, [tableValue]);

  useEffect(() => {
    if (filterType === "select" || filterType === "none") return;

    if (debouncedValue !== String(column.getFilterValue() ?? "")) {
      column.setFilterValue(debouncedValue);
    }
  }, [debouncedValue, column, filterType]);

  const clearFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setInputValue("");
    column.setFilterValue("");
  };

  if (filterType === "none") return null;

  if (filterType === "select") {
    return (
      <div className="relative mt-2">
        <select
          value={String(tableValue)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onChange={(e) => column.setFilterValue(e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 pr-7 text-xs font-medium text-slate-200 outline-none"
        >
          <option value="">All</option>

          {options.map((item) => (
            <option key={item} value={item} className="font-medium">
              {item}
            </option>
          ))}
        </select>

        {String(tableValue).trim() !== "" && (
          <button
            type="button"
            onClick={clearFilter}
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded px-1 text-xs text-slate-400 hover:bg-slate-700 hover:text-white"
            title="Clear filter"
          >
            ×
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative mt-2">
      <input
        value={inputValue}
        type={
          filterType === "date"
            ? "date"
            : filterType === "number"
            ? "number"
            : "text"
        }
        placeholder="Search"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 pr-7 text-xs font-medium text-slate-200 outline-none placeholder:text-slate-500"
      />

      {hasValue && (
        <button
          type="button"
          onClick={clearFilter}
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded px-1 text-xs text-slate-400 hover:bg-slate-700 hover:text-white"
          title="Clear filter"
        >
          ×
        </button>
      )}
    </div>
  );
}