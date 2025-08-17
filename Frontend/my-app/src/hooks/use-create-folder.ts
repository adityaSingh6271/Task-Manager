// hooks/useCreateFolder.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Folder } from "@/types";

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
    onSuccess: () => {
      // invalidate profile or folders query so UI refetches
      queryClient.invalidateQueries({ queryKey: ["profile", token] });
      queryClient.invalidateQueries({ queryKey: ["folders", token] });
    },
  });
};
