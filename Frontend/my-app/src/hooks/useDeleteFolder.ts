import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

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
    },
  });
};
