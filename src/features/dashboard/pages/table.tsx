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
  useContextMenu
} from "react-contexify";

import "react-contexify/dist/ReactContexify.css";
import { useUpdateMigrationStatus } from "../hooks/useUpdateMigrationStatus";
import { columnFiltersToObject } from "../hooks/useColumnFiltersToObject";
import { getLast24HoursFilter } from "@/Share/hooks/getLast24HoursFilter";
const MENU_ID = "menu-id";

const RESTATUS_ALLOWED_STATUS = [
  "TRANSFER_FAILED",
  "METADATA_UPDATE_FAILED",
  "MIGRATION_FAILED",
  "TRANSFER_COMPLETED_MOVE_FAILED"
];



export default function MigrationPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const [openDialog, setOpenDialog] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const updateStatusMutation = useUpdateMigrationStatus();
  const [selectedRow, setSelectedRow] = useState<AssetData | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: "assetTransferedDate",
      value: getLast24HoursFilter(),
    },
  ]);

  const backendFilters = useMemo(
    () => columnFiltersToObject(columnFilters),
    [columnFilters]
  );

  const canRestatus =
    selectedRows.length > 0 &&
    selectedRows.every((row) =>
      RESTATUS_ALLOWED_STATUS.includes(row.status ?? row.STATUS ?? "")
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
    const rowsToUpdate = selectedRows.length > 0 ? selectedRows : [];

    if (rowsToUpdate.length === 0) {
      console.warn("No rows selected");
      return;
    }

    const payloadRows = rowsToUpdate
      .map((row) => ({
        URN: row?.URN,
        status: row?.status ?? row?.STATUS,
      }))
      .filter((row) => row.URN && row.status);


    if (payloadRows.length === 0) {
      console.warn("URN or status missing", rowsToUpdate);
      return;
    }

    updateStatusMutation.mutate({
      filters: payloadRows,
    });
  }


  function displayMenu(
    e: React.MouseEvent<HTMLTableRowElement>,
    rowData: AssetData
  ) {
    e.preventDefault();

    const rowUrn = rowData?.URN;

    const isAlreadySelected = selectedRows.some(
      (row) => row?.URN === rowUrn
    );

    // If right-clicked row is already part of selected rows,
    // keep multiple selection.
    if (!isAlreadySelected) {
      setSelectedRows([rowData]);
    }

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
        configUrl={`${import.meta.env.BASE_URL}config/app-config.json`}
        columnKey="migrationColumns"
        isLoading={isLoading}
        onRowDoubleClick={onRowDoubleClick}
        displayMenu={displayMenu}
        onSelectedRowsChange={setSelectedRows}
      />
      {
        openDialog && (
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <Suspense fallback={""}>
              <IndexPopup data={selectedRow} setOpenDialog={setOpenDialog} />
            </Suspense>
          </Dialog>
        )
      }
      <Menu id={MENU_ID}>
        <Item onClick={() => handleItemClick()} disabled={!canRestatus}>Re-status</Item>
      </Menu>
    </div>
  );
}