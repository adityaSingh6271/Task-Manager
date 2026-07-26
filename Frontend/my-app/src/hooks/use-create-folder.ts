// hooks/useCreateFolder.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Folder } from "@/types";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";

export const useCreateFolder = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; color: string }) => {
      const res = await api.post<Folder>(
        "/folders/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["profile", token] });
      queryClient.invalidateQueries({ queryKey: ["folders", token] });
      toast.success("Project created", { description: `“${project.name}” is ready for tasks.` });
    },
    onError: (error) => toast.error("Could not create project", { description: getApiErrorMessage(error) }),
  });
};
