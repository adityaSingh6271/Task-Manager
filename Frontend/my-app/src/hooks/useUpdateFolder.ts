import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Folder } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";

interface UpdateFolderPayload {
  id: string;      // folder id to update
  name: string;
  color: string;
}

export const useUpdateFolder = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const queryClient = useQueryClient();

  return useMutation<Folder, Error, UpdateFolderPayload>({
    mutationFn: async (data: UpdateFolderPayload) => {
      const { id, ...payload } = data; // extract id for URL
      const res = await api.put<Folder>(`/folders/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Project updated", { description: `“${project.name}” was updated.` });
    },
    onError: (error) => toast.error("Could not update project", { description: getApiErrorMessage(error) }),
  });
};
