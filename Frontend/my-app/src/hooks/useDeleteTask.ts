import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const useDeleteTask = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id; 
    },
    onSuccess: (deletedId) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ["tasks", token] });
      queryClient.invalidateQueries({ queryKey: ["task", deletedId, token] });
    },
  });
};
