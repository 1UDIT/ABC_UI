import { useQuery } from "@tanstack/react-query";
import { getMigrationData } from "@/features/dashboard/service/migrationApi";   
import type { PaginationState, SortingState } from "@tanstack/react-table";
 

export function useMigrationData(
  pagination: PaginationState,
  sorting: SortingState = [],
  filters: Record<string, unknown> = {}
) {
  return useQuery({
    queryKey: [
      "migration-data",
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      filters,
    ],
    queryFn: () =>
      getMigrationData({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sorting,
        filters,
      }),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}