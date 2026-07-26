import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { ProfileData } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";

export const useProfile = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  const query = useQuery<ProfileData>({
    queryKey: ["profile", token],
    queryFn: async () => {
      const res = await api.get<ProfileData>("/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
  });
  useEffect(() => {
    if (query.isError) toast.error("Could not load your workspace", { description: getApiErrorMessage(query.error) });
  }, [query.isError, query.errorUpdatedAt]);
  return query;
};
