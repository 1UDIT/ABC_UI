import type {
  PaginationState,
  SortingState,
  ColumnFiltersState,
  OnChangeFn
} from "@tanstack/react-table";

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

type ColumnConfigKey = "migrationColumns" | "markerColumns";
export type DynamicTableProps = {
  data: any[];
  rowCount: number;
  configUrl?: string;
  columnKey: ColumnConfigKey;
  isLoading?: boolean;

  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;

  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;

  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  onRowDoubleClick?: (rowData: any) => void;
  displayMenu?: (e: React.MouseEvent<HTMLTableRowElement>, rowData: any) => void;
  navigationdisplay?: boolean;
  removeFilters?: boolean;
};

export type CalendarMode = "single" | "range";

export type ColumnConfig = {
  accessorKey: string;
  header: string;
  type: FilterType;
  filter?: boolean;
  options?: string[];
  width?: number;
  size?: number;
  minSize?: number;
  maxSize?: number;
  calendarMode?: CalendarMode;
  numberOfMonths?: number;
};

export type TableConfig = {
  migrationColumns: ColumnConfig[];
  markerColumns: ColumnConfig[];
};
 