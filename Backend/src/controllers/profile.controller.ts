// src/controllers/profile.controller.ts
import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { z } from "zod";

const profileInput = z.object({
  name: z.string().trim().min(1, "Name is required").max(100).optional(),
  avatar: z.string().url("Avatar must be a valid URL").nullable().optional(),
});

export const getProfileData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Fetch folders with tasks
    const folders = await prisma.folder.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        color: true,
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
            tags: true,
            isPriority: true,
            priorityOrder: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    // Transform folders to add taskCount
    const mappedFolders = folders.map(f => ({
      id: f.id,
      name: f.name,
      color: f.color,
      taskCount: f.tasks.length,
      tasks: f.tasks,
    }));

    res.json({
      user,
      folders: mappedFolders,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const parsed = profileInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
    if (!Object.keys(parsed.data).length) return res.status(400).json({ error: "No profile changes supplied" });
    const user = await prisma.user.update({
      where: { id: userId },
      data: parsed.data,
      select: { id: true, name: true, email: true, avatar: true },
    });
    return res.json(user);
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ error: "Could not update profile" });
  }
};
