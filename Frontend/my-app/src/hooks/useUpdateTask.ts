// hooks/useUpdateTask.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Task } from "@/types";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";

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
        `/tasks/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: (task, variables) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      const { data } = variables;
      const title = data.status === "COMPLETED" ? "Task completed" : data.status === "PENDING" ? "Task reopened" : data.isPriority === true ? "Added to today’s priorities" : data.isPriority === false ? "Removed from today’s priorities" : data.dueDate ? "Task scheduled" : "Task updated";
      toast.success(title, { description: `“${task.title}” is up to date.` });
    },
    onError: (error) => toast.error("Could not update task", { description: getApiErrorMessage(error) }),
  });
};
