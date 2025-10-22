// hooks/useCreateTask.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { CreateTaskData, Task } from "@/types";

export const useCreateTask = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskData) => {
      const res = await api.post<Task>(
        "/tasks/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      // invalidate to refetch tasks & folders
      queryClient.invalidateQueries({ queryKey: ["profile"] });

    },
  });
};
