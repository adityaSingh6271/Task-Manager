// src/controllers/folder.controller.ts

import { Request, Response } from "express";
import prisma from "../lib/prisma";

//Get all Folders

export const getFolders = async (req: Request, res: Response) => {
  try {
    const folders = await prisma.folder.findMany({
      include: { tasks: true },
    });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch folders" });
  }
};

//create folder
export const createFolder = async (req: Request, res: Response) => {
  try {
    const { name, color, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ error: "Name and userId are required" });
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
export const updateFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Folder ID is required" });
    }

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
