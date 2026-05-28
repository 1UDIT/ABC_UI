import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  updateMigrationStatus,
  type UpdateStatusPayload,
} from "../service/updateStatus";

export function useUpdateMigrationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateStatusPayload) =>
      updateMigrationStatus(payload),

    onSuccess: (data) => {
      toast.success(data?.message || "Status updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["migration-data"],
      });

      queryClient.invalidateQueries({
        queryKey: ["markers-dialog-data"],
      });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Status update failed";

      toast.error(String(message));
    },
  });
}