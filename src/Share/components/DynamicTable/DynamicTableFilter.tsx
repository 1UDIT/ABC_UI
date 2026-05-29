import { useEffect, useState } from "react";
import type { Column } from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";

import type { FilterType } from "./types";
import { useDebounce } from "@/Share/hooks/useDebounce";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; 

type CalendarMode = "single" | "range";

type Props<T> = {
  column: Column<T, unknown>;
  filterType?: FilterType;
  options?: string[];
  debounceDelay?: number;
  calendarMode?: CalendarMode;
  numberOfMonths?: number;
};

type DateRangeFilterValue = {
  from?: string;
  to?: string;
};

function toDate(value?: string) {
  if (!value) return undefined;
  return new Date(value);
}

function toDateString(date?: Date) {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
}

export function DynamicTableFilter<T>({
  column,
  filterType = "text",
  options = [],
  debounceDelay = 500,
  calendarMode = "single",
  numberOfMonths = 1,
}: Props<T>) {
  const tableValue = column.getFilterValue() ?? "";
  const [inputValue, setInputValue] = useState(String(tableValue));

  const debouncedValue = useDebounce(inputValue, debounceDelay);
  const hasValue = String(inputValue).trim() !== "";

  useEffect(() => {
    if (filterType === "date" && calendarMode === "range") return;
    setInputValue(String(tableValue));
  }, [tableValue, filterType, calendarMode]);

  useEffect(() => {
    if (
      filterType === "select" ||
      filterType === "multiSelect" ||
      filterType === "none" ||
      (filterType === "date" && calendarMode === "range")
    ) {
      return;
    }

    if (debouncedValue !== String(column.getFilterValue() ?? "")) {
      column.setFilterValue(debouncedValue);
    }
  }, [debouncedValue, column, filterType, calendarMode]);

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

  if (filterType === "date" && calendarMode === "range") {
    const rangeValue = (tableValue || {}) as DateRangeFilterValue;

    const selectedRange: DateRange | undefined = {
      from: toDate(rangeValue.from),
      to: toDate(rangeValue.to),
    };

    const label =
      rangeValue.from && rangeValue.to
        ? `${format(toDate(rangeValue.from)!, "dd-MM-yyyy")} to ${format(
          toDate(rangeValue.to)!,
          "dd-MM-yyyy"
        )}`
        : rangeValue.from
          ? format(toDate(rangeValue.from)!, "dd-MM-yyyy")
          : "Pick a date";

    const hasRangeValue = Boolean(rangeValue.from || rangeValue.to);

    const clearCalendarFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      column.setFilterValue("");
    };

    return (
      <Popover>
        <div
          className="relative mt-2"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md border border-slate-700 bg-slate-950 px-2 py-1 pr-7 text-left text-xs font-semibold text-slate-100 outline-none hover:border-orange-400"
            >
              <span className="truncate">{label}</span>
            </button>
          </PopoverTrigger>

          {hasRangeValue && (
            <button
              type="button"
              onClick={clearCalendarFilter}
              className="absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded px-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
              title="Clear date filter"
            >
              ×
            </button>
          )}
        </div>

        <PopoverContent
          align="center"
          side="bottom"
          sideOffset={8}
          collisionPadding={16}
          avoidCollisions={false}
          className="z-[99999] w-[420px] max-w-[90vw] rounded-lg border border-slate-700 bg-[#020817] text-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {/* <div className="mb-2 flex items-center justify-between border-b border-slate-700 pb-2">
            <span className="text-xs font-semibold text-slate-300">
              Select date range
            </span>

            {hasRangeValue && (
              <button
                type="button"
                onClick={clearCalendarFilter}
                className="rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
              >
                Clear
              </button>
            )}
          </div> */}

          <Calendar
            mode="range"
            selected={selectedRange}
            numberOfMonths={numberOfMonths}
            classNames={{
              day: "h-8 w-8 p-0 font-normal text-white",
              selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white",
              range_start: "bg-blue-600 text-white rounded-l-md",
              range_end: "bg-blue-600 text-white rounded-r-md",
              range_middle: "bg-blue-900/70 text-white rounded-none",
              today: "bg-slate-800 text-white",
              outside: "text-slate-600 opacity-50",
            }}
            onSelect={(range) => {
              column.setFilterValue({
                from: toDateString(range?.from),
                to: toDateString(range?.to),
              });
            }}
            className="rounded-md bg-[#020817] text-white"
          />
        </PopoverContent>
      </Popover>
    );
  }

  if (filterType === "multiSelect") {
    const selectedValues = Array.isArray(tableValue) ? tableValue : [];

    const toggleValue = (item: string) => {
      const exists = selectedValues.includes(item);

      const nextValues = exists
        ? selectedValues.filter((value) => value !== item)
        : [...selectedValues, item];

      column.setFilterValue(nextValues);
    };

    // const clearMultiSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    //   e.preventDefault();
    //   e.stopPropagation();

    //   column.setFilterValue([]);
    // };

    return (
      <Popover>
        <div
          className="relative mt-2"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md border border-slate-700 bg-slate-950 px-2 py-1 pr-7 text-left text-xs font-medium text-slate-200 outline-none hover:border-blue-400"
            >
              <span className="truncate">
                {selectedValues.length > 0
                  ? `${selectedValues.length} selected`
                  : "Select"}
              </span>
            </button>
          </PopoverTrigger>

          {selectedValues.length > 0 && (
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

        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={6}
          collisionPadding={12}
          className="z-[99999] w-64 rounded-md border border-slate-700 bg-slate-950 p-2 text-slate-200 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        > 
          <div className="max-h-56 space-y-1 overflow-auto">
            {options.map((item) => {
              const checked = selectedValues.includes(item);

              return (
                <label
                  key={item}
                  className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs hover:bg-slate-800 ${checked ? "bg-blue-900/40 text-white" : "text-slate-300"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleValue(item)}
                    className="h-3.5 w-3.5 accent-blue-600"
                  />

                  <span className="truncate">{item}</span>
                </label>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
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