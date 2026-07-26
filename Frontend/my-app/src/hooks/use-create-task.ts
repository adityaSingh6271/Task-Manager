// hooks/useCreateTask.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { CreateTaskData, Task } from "@/types";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";

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
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Task added", { description: `“${task.title}” was added to your Inbox.` });
    },
    onError: (error) => toast.error("Could not add task", { description: getApiErrorMessage(error) }),
  });
};
