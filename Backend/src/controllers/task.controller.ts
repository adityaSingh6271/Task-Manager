import { Response } from "express";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

const taskInput = z.object({
  title: z.string().trim().min(1).max(250).optional(),
  description: z.string().max(5000).nullable().optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  folderId: z.string().uuid().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  isPriority: z.boolean().optional(),
  priorityOrder: z.number().int().min(1).max(3).nullable().optional(),
});

async function ownedFolder(folderId: string, userId: string) {
  return prisma.folder.findFirst({ where: { id: folderId, userId }, select: { id: true } });
}

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const parsed = taskInput.extend({ title: z.string().trim().min(1).max(250), folderId: z.string().uuid() }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
    const data = parsed.data;
    if (!await ownedFolder(data.folderId, userId)) return res.status(404).json({ error: "Project not found" });
    const task = await prisma.task.create({ data: {
      title: data.title, description: data.description, priority: data.priority ?? TaskPriority.MEDIUM,
      folderId: data.folderId, dueDate: data.dueDate ? new Date(data.dueDate) : null, tags: data.tags ?? [], userId,
      isPriority: data.isPriority ?? false, priorityOrder: data.isPriority ? data.priorityOrder ?? 3 : null,
    }});
    return res.status(201).json(task);
  } catch (error) { console.error(error); return res.status(500).json({ error: "Failed to create task" }); }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const parsed = taskInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
    const task = await prisma.task.findFirst({ where: { id: req.params.id, userId }, select: { id: true } });
    if (!task) return res.status(404).json({ error: "Task not found" });
    const data = parsed.data;
    if (data.folderId && !await ownedFolder(data.folderId, userId)) return res.status(404).json({ error: "Project not found" });
    const updated = await prisma.task.update({ where: { id: task.id }, data: {
      ...data, dueDate: data.dueDate === undefined ? undefined : data.dueDate ? new Date(data.dueDate) : null,
      priorityOrder: data.isPriority === false ? null : data.priorityOrder,
    }});
    return res.json(updated);
  } catch (error) { console.error(error); return res.status(500).json({ error: "Failed to update task" }); }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const task = await prisma.task.findFirst({ where: { id: req.params.id, userId }, select: { id: true } });
    if (!task) return res.status(404).json({ error: "Task not found" });
    await prisma.task.delete({ where: { id: task.id } });
    return res.json({ message: "Task deleted successfully" });
  } catch (error) { console.error(error); return res.status(500).json({ error: "Failed to delete task" }); }
};
