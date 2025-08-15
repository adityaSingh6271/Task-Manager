import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { ProfileData } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const useProfile = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return useQuery<ProfileData>({
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
};
