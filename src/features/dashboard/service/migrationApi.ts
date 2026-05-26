import { axiosClient } from "@/core/api/axiosClient";
import { API_ENDPOINTS } from "@/core/api/apiEndpoints";

type MigrationListParams = {
  page: number;
  limit: number;
  filters?: Record<string, unknown>;
  sorting?: {
    id: string;
    desc: boolean;
  }[];
};

export async function getMigrationData({
  page,
  limit,
  filters = {},
  sorting = [],
}: MigrationListParams) {
  console.log("API page:", page, "limit:", limit);
  console.log("API filters:", filters);
  console.log("API sorting:", sorting);

  const response = await axiosClient.post(
    API_ENDPOINTS.migration.list,
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