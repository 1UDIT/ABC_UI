import { axiosClient } from "@/core/api/axiosClient";
import { API_ENDPOINTS } from "@/core/api/apiEndpoints";

type markerListParams = {
  page: number;
  limit: number;
  filters?: Record<string, unknown>;
  sorting?: {
    id: string;
    desc: boolean;
  }[];
};

export async function getmarkersDataDialog({
  page,
  limit,
  filters = {},
  sorting = [],
}: markerListParams) {
  // console.log("API page:", page, "limit:", limit);
  // console.log("API filters:", filters);
  // console.log("API sorting:", sorting);

  const response = await axiosClient.post(
    API_ENDPOINTS.migration.detailsByUrn,
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