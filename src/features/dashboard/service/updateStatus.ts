import { axiosClient } from "@/core/api/axiosClient";
import { API_ENDPOINTS } from "@/core/api/apiEndpoints";

export type UpdateStatusPayload = {
  URN: string;
  status: string;
};

export async function updateMigrationStatus(payload: UpdateStatusPayload) {
  const response = await axiosClient.post(
    API_ENDPOINTS.migration.updateStatus,
    payload
  );

  return response.data;
}