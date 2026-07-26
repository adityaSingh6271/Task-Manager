"use client";

import { useEffect, useState } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";
import { WorkspaceShell } from "@/components/dashboard/workspace-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNotes, useCreateNote, useDeleteNote, useUpdateNote } from "@/hooks/use-notes";
import { useProfile } from "@/hooks/useProfile";
import type { Note } from "@/types";

export default function NotesPage() {
  const { data: profile } = useProfile(); const { data: notes = [] } = useNotes(); const createNote = useCreateNote(); const updateNote = useUpdateNote(); const deleteNote = useDeleteNote();
  const [selected, setSelected] = useState<Note | null>(null); const [title, setTitle] = useState(""); const [content, setContent] = useState(""); const [folderId, setFolderId] = useState("");
  useEffect(() => { if (!selected && notes[0]) setSelected(notes[0]); }, [notes, selected]);
  useEffect(() => { if (selected) { setTitle(selected.title); setContent(selected.content); setFolderId(selected.folderId ?? ""); } }, [selected]);
  const newNote = async () => { const note = await createNote.mutateAsync({ title: "Untitled note", content: "", folderId: null }); setSelected(note); };
  const save = () => selected && updateNote.mutate({ id: selected.id, title: title.trim() || "Untitled note", content, folderId: folderId || null });
  return <WorkspaceShell><main className="mx-auto max-w-7xl p-5 sm:p-8"><div className="mb-6 flex items-end justify-between"><div><p className="text-sm font-semibold text-blue-400">Notes</p><h1 className="text-3xl font-bold">Keep the context with the work</h1><p className="mt-1 text-muted-foreground">Create meeting notes, plans, and project knowledge beside your tasks.</p></div><Button onClick={newNote}><Plus className="mr-2 h-4 w-4" />New note</Button></div><div className="grid min-h-[560px] overflow-hidden rounded-xl border border-border bg-card md:grid-cols-[280px_1fr]"><aside className="border-b border-border p-3 md:border-r md:border-b-0">{notes.length ? notes.map((note) => <button key={note.id} onClick={() => setSelected(note)} className={selected?.id === note.id ? "mb-1 w-full rounded-lg bg-blue-500/15 p-3 text-left" : "mb-1 w-full rounded-lg p-3 text-left hover:bg-muted"}><p className="truncate font-medium">{note.title}</p><p className="mt-1 truncate text-xs text-muted-foreground">{note.content || "Empty note"}</p></button>) : <div className="p-5 text-sm text-muted-foreground">No notes yet. Create one for a meeting, idea, or project plan.</div>}</aside><section className="p-5">{selected ? <div className="space-y-4"><div className="flex flex-col gap-3 sm:flex-row"><Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-lg font-semibold" /><Select value={folderId} onValueChange={setFolderId}><SelectTrigger className="sm:w-52"><SelectValue placeholder="No project" /></SelectTrigger><SelectContent>{profile?.folders.map((project) => <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>)}</SelectContent></Select></div><Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your note…" className="min-h-80 resize-none leading-7" /><div className="flex justify-between"><Button variant="ghost" className="text-destructive hover:text-destructive" onClick={() => { deleteNote.mutate(selected.id); setSelected(null); }}><Trash2 className="mr-2 h-4 w-4" />Delete</Button><Button onClick={save} disabled={updateNote.isPending}>Save note</Button></div></div> : <Card><CardContent className="p-10 text-center text-muted-foreground"><FileText className="mx-auto mb-3 h-7 w-7" />Select or create a note.</CardContent></Card>}</section></div></main></WorkspaceShell>;
}
