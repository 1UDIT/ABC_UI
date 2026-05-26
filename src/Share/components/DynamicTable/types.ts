// src/shared/components/DynamicTable/types.ts

import type { ColumnDef } from "@tanstack/react-table";

export type FilterType = "text" | "select" | "number" | "date" | "none";

export type DynamicColumnConfig<T> = {
  key: keyof T | string;
  label: string;
  enableSorting?: boolean;
  enableFilter?: boolean;
  filterType?: FilterType;
  width?: number;
  options?: string[];
  cell?: (value: any, row: T) => React.ReactNode;
};

export type DynamicTableProps<T> = {
  data: T[];
  columnsConfig: DynamicColumnConfig<T>[];
  isLoading?: boolean;
};