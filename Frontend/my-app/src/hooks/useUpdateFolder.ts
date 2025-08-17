import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Folder } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface UpdateFolderPayload {
  id: string;      // folder id to update
  name: string;
  color: string;
}

export const useUpdateFolder = () => {
  const token = useSelector((state: RootState) => state.auth.token);

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
  });
};
