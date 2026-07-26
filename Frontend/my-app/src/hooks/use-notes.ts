import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import type { Note } from "@/types";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

type NoteInput = Pick<Note, "title" | "content" | "folderId">;

export function useNotes() {
  const token = useSelector((state: RootState) => state.auth.token);
  return useQuery({
    queryKey: ["notes", token],
    queryFn: async () => (await api.get<Note[]>("/notes")).data,
    enabled: !!token,
  });
}

export function useCreateNote() {
  const query = useQueryClient();
  const token = useSelector((state: RootState) => state.auth.token);
  return useMutation({
    mutationFn: async (data: NoteInput) => (await api.post<Note>("/notes", data)).data,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["notes", token] });
      toast.success("Note created");
    },
    onError: (e) => toast.error("Could not create note", { description: getApiErrorMessage(e) }),
  });
}

export function useUpdateNote() {
  const query = useQueryClient();
  const token = useSelector((state: RootState) => state.auth.token);
  return useMutation({
    mutationFn: async ({ id, ...data }: NoteInput & { id: string }) =>
      (await api.put<Note>(`/notes/${id}`, data)).data,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["notes", token] });
      toast.success("Note saved");
    },
    onError: (e) => toast.error("Could not save note", { description: getApiErrorMessage(e) }),
  });
}

export function useDeleteNote() {
  const query = useQueryClient();
  const token = useSelector((state: RootState) => state.auth.token);
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/notes/${id}`),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["notes", token] });
      toast.success("Note deleted");
    },
    onError: (e) => toast.error("Could not delete note", { description: getApiErrorMessage(e) }),
  });
}
