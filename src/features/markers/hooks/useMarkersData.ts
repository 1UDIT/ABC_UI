import { useQuery } from "@tanstack/react-query";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { getMarkerData } from "../service/markerApi";


export function useMarkerData(
  pagination: PaginationState,
  sorting: SortingState = [],
  filters: Record<string, unknown> = {}
) {
  return useQuery({
    queryKey: [
      "marker-data",
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      filters,
    ],
    queryFn: () =>
      getMarkerData({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sorting,
        filters,
      }),
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchInterval: 20000,
  });
}