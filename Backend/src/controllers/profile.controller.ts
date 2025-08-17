// src/controllers/profile.controller.ts
import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

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
