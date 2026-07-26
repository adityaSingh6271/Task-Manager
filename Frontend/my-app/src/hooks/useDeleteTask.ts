import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Task deleted");
    },
    onError: (error) => toast.error("Could not delete task", { description: getApiErrorMessage(error) }),
  });
};
