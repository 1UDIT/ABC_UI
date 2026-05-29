import type { ColumnFiltersState } from "@tanstack/react-table";

export function columnFiltersToObject(columnFilters: ColumnFiltersState) {
  return columnFilters?.reduce<Record<string, unknown>>((acc, filter) => {
    const value = filter.value;

    if (Array.isArray(value)) {
      if (value.length > 0) {
        acc[filter.id] = value;
      }

      return acc;
    }

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      acc[filter.id] = value;
    }

    return acc;
  }, {});
}