import { useQuery } from "@tanstack/react-query";  
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { getmarkersDataDialog } from "../service/markersApi";
 

export function useMarkersDialogData(
  pagination: PaginationState,
  sorting: SortingState = [],
  filters: Record<string, unknown> = {}
) {
  return useQuery({
    queryKey: [
      "markers-dialog-data",
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      filters,
    ],
    queryFn: () =>
      getmarkersDataDialog({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sorting,
        filters,
      }),
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled: !!filters.URN,
  });
}