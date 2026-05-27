import { lazy, Suspense, useMemo, useState } from "react";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import {
  Dialog,
} from "@/components/ui/dialog"
import { DynamicTable } from "@/Share/components/DynamicTable/DynamicTable";
import { useMigrationData } from "../hooks/useMigrationData";
import type { AssetData } from "../Type/AssetData";
const IndexPopup = lazy(() => import("@/features/dashboard/Dialoag/page"));
import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu
} from "react-contexify";

import "react-contexify/dist/ReactContexify.css";
const MENU_ID = "menu-id";

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



export default function MigrationPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const [openDialog, setOpenDialog] = useState(false);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRow, setSelectedRow] = useState<AssetData | null>(null);

  const backendFilters = useMemo(
    () => columnFiltersToObject(columnFilters),
    [columnFilters]
  );

  const { data, isLoading, isError, error } = useMigrationData(
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

  const onRowDoubleClick = (row: AssetData) => {
    // console.log("Row double-clicked:", row);
    setSelectedRow(row);
    setOpenDialog(true);
  }

  const { show } = useContextMenu({
    id: MENU_ID
  });

  function handleItemClick() {
    console.log("Context menu item clicked for row:", selectedRow);
  }

  function displayMenu(e: React.MouseEvent<HTMLTableRowElement>, rowData: AssetData) {
    // put whatever custom logic you need
    // you can even decide to not display the Menu
    setSelectedRow(rowData);
    show({
      event: e,
    });
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
        columnKey="migrationColumns"
        isLoading={isLoading}
        onRowDoubleClick={onRowDoubleClick}
        displayMenu={displayMenu}  
      />
      {
        openDialog && (
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <Suspense fallback={""}>
              <IndexPopup data={selectedRow} setOpenDialog={setOpenDialog} openDialog={openDialog} />
            </Suspense>
          </Dialog>
        )
      }
      <Menu id={MENU_ID}>
        <Item onClick={() => handleItemClick()}>Action 1</Item>
        <Item onClick={() => handleItemClick()}>Action 2</Item>
        <Separator />
        <Item onClick={() => handleItemClick()}>Action 3</Item>
      </Menu>
    </div>
  );
}