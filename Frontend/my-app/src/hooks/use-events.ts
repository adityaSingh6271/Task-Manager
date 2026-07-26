import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import type { Event } from "@/types";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

type EventInput = Pick<Event, "title" | "startAt" | "endAt" | "allDay" | "folderId"> & { description?: string };

export function useEvents() {
  const token = useSelector((state: RootState) => state.auth.token);
  return useQuery({
    queryKey: ["events", token],
    queryFn: async () => (await api.get<Event[]>("/events")).data,
    enabled: !!token,
  });
}

export function useCreateEvent() {
  const query = useQueryClient();
  const token = useSelector((state: RootState) => state.auth.token);
  return useMutation({
    mutationFn: async (data: EventInput) => (await api.post<Event>("/events", data)).data,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["events", token] });
      toast.success("Event added to calendar");
    },
    onError: (e) => toast.error("Could not add event", { description: getApiErrorMessage(e) }),
  });
}

export function useDeleteEvent() {
  const query = useQueryClient();
  const token = useSelector((state: RootState) => state.auth.token);
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/events/${id}`),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["events", token] });
      toast.success("Event deleted");
    },
    onError: (e) => toast.error("Could not delete event", { description: getApiErrorMessage(e) }),
  });
}
