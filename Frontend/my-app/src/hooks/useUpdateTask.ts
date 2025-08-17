// hooks/useUpdateTask.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Task } from "@/types";

export const useUpdateTask = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>;
    }) => {
      const res = await api.put<Task>(
        `/tasks/update/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      // Refetch tasks after update
      queryClient.invalidateQueries({ queryKey: ["tasks", token] });
      queryClient.invalidateQueries({ queryKey: ["task", variables.id, token] });
    },
  });
};
