import { axiosClient } from "@/core/api/axiosClient";
import { API_ENDPOINTS } from "@/core/api/apiEndpoints";

type MarkerListParams = {
  page: number;
  limit: number;
  filters?: Record<string, unknown>;
  sorting?: {
    id: string;
    desc: boolean;
  }[];
};

export async function getMarkerData({
  page,
  limit,
  filters = {},
  sorting = [],
}: MarkerListParams) {
  console.log("API page:", page, "limit:", limit);
  console.log("API filters:", filters);
  console.log("API sorting:", sorting);

  const response = await axiosClient.post(
    API_ENDPOINTS.markers.list,
    {
      filters,
      sorting,
    },
    {
      params: {
        page,
        limit,
      },
    }
  );

  return response.data;
}