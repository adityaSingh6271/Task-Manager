import { Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

const eventInput = z.object({
  title: z.string().trim().min(1).max(250),
  description: z.string().max(5000).nullable().optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  allDay: z.boolean().optional(),
  folderId: z.string().uuid().nullable().optional(),
});

async function validFolder(folderId: string | null | undefined, userId: string) {
  return !folderId || !!await prisma.folder.findFirst({ where: { id: folderId, userId }, select: { id: true } });
}

export async function listEvents(req: AuthRequest, res: Response) {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const events = await prisma.event.findMany({ where: { userId }, orderBy: { startAt: "asc" } });
  return res.json(events);
}

export async function createEvent(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const parsed = eventInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
    const data = parsed.data;
    if (new Date(data.endAt) <= new Date(data.startAt)) return res.status(400).json({ error: "End time must be after start time" });
    if (!await validFolder(data.folderId, userId)) return res.status(404).json({ error: "Project not found" });
    return res.status(201).json(await prisma.event.create({ data: { ...data, startAt: new Date(data.startAt), endAt: new Date(data.endAt), userId } }));
  } catch { return res.status(500).json({ error: "Could not create event" }); }
}

export async function updateEvent(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const parsed = eventInput.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
    const existing = await prisma.event.findFirst({ where: { id: req.params.id, userId } });
    if (!existing) return res.status(404).json({ error: "Event not found" });
    const data = parsed.data;
    if (!await validFolder(data.folderId, userId)) return res.status(404).json({ error: "Project not found" });
    const startAt = data.startAt ? new Date(data.startAt) : existing.startAt;
    const endAt = data.endAt ? new Date(data.endAt) : existing.endAt;
    if (endAt <= startAt) return res.status(400).json({ error: "End time must be after start time" });
    return res.json(await prisma.event.update({ where: { id: existing.id }, data: { ...data, startAt, endAt } }));
  } catch { return res.status(500).json({ error: "Could not update event" }); }
}

export async function deleteEvent(req: AuthRequest, res: Response) {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const event = await prisma.event.findFirst({ where: { id: req.params.id, userId }, select: { id: true } });
  if (!event) return res.status(404).json({ error: "Event not found" });
  await prisma.event.delete({ where: { id: event.id } });
  return res.json({ message: "Event deleted" });
}
