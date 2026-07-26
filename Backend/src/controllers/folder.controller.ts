// src/controllers/folder.controller.ts

import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

//Get all Folders

export const getFolders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) return res.status(401).json({ error: "Unauthorized" });
    const folders = await prisma.folder.findMany({ where: { userId: req.user.userId }, include: { tasks: true } });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch folders" });
  }
};

//create folder
export const createFolder = async (req: AuthRequest, res: Response) => {
  try {
    const { name, color } = req.body;
    const userId = req.user?.userId;
    if (!name || !userId) {
      return res.status(400).json({ error: "Name is required" });
    }

    const folder = await prisma.folder.create({
      data: {
        name,
        color: color ?? "#000000",
        userId,
      },
    });

    console.log("create folder:", folder);

    res.status(201).json(folder);
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ error: "Failed to create folder" });
  }
};

// update folder
export const updateFolder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Folder ID is required" });
    }
    if (!req.user?.userId) return res.status(401).json({ error: "Unauthorized" });
    const existing = await prisma.folder.findFirst({ where: { id, userId: req.user.userId } });
    if (!existing) return res.status(404).json({ error: "Project not found" });

    const folder = await prisma.folder.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(color && { color }),
      },
    });

    res.json(folder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update folder" });
  }
};

// delete folder
export const deleteFolder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Folder ID is required" });
    }
    if (!req.user?.userId) return res.status(401).json({ error: "Unauthorized" });
    const existing = await prisma.folder.findFirst({ where: { id, userId: req.user.userId } });
    if (!existing) return res.status(404).json({ error: "Project not found" });

    // Keep deletion reliable before/after the cascade migration is deployed.
    // The UI always asks for explicit confirmation because these tasks are permanent.
    const [, folder] = await prisma.$transaction([
      prisma.task.deleteMany({ where: { folderId: id } }),
      prisma.folder.delete({ where: { id } }),
    ]);

    res.json({ message: "Folder deleted successfully", folder });
  } catch (error: any) {
    console.error("Error deleting folder:", error);

    if (error.code === "P2025") {
      // Prisma not found error
      return res.status(404).json({ error: "Folder not found" });
    }

    res.status(500).json({ error: "Failed to delete folder" });
  }
};

