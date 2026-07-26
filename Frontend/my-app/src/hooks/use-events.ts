import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import type { Event } from "@/types";

type EventInput = Pick<Event, "title" | "startAt" | "endAt" | "allDay" | "folderId"> & { description?: string };
export function useEvents() { return useQuery({ queryKey: ["events"], queryFn: async () => (await api.get<Event[]>("/events")).data }); }
export function useCreateEvent() { const query = useQueryClient(); return useMutation({ mutationFn: async (data: EventInput) => (await api.post<Event>("/events", data)).data, onSuccess: () => { query.invalidateQueries({ queryKey: ["events"] }); toast.success("Event added to calendar"); }, onError: (e) => toast.error("Could not add event", { description: getApiErrorMessage(e) }) }); }
export function useDeleteEvent() { const query = useQueryClient(); return useMutation({ mutationFn: async (id: string) => api.delete(`/events/${id}`), onSuccess: () => { query.invalidateQueries({ queryKey: ["events"] }); toast.success("Event deleted"); }, onError: (e) => toast.error("Could not delete event", { description: getApiErrorMessage(e) }) }); }
