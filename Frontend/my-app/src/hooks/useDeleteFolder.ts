import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";

interface DeleteFolderPayload {
  id: string; // folder id to delete
}

export const useDeleteFolder = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteFolderPayload>({
    mutationFn: async ({ id }) => {
      await api.delete(`/folders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      // ✅ Refetch profile so folders & tasks update immediately
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Project deleted");
    },
    onError: (error) => toast.error("Could not delete project", { description: getApiErrorMessage(error) }),
  });
};
