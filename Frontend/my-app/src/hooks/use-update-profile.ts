import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import type { ProfileData, User } from "@/types";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; avatar?: string | null }) => (await api.put<User>("/profile/me", data)).data,
    onSuccess: (user) => {
      queryClient.setQueriesData<ProfileData>({ queryKey: ["profile"] }, (current) => current ? { ...current, user } : current);
      toast.success("Profile updated", { description: "Your details are saved." });
    },
    onError: (error) => toast.error("Could not update profile", { description: getApiErrorMessage(error) }),
  });
}
