//src/controllers/task.controller.ts

import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { TaskPriority } from "@prisma/client";

// Create task
export const createTask = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description, // optional
      priority,
      folderId,
      dueDate,
      tags, // optional
    }: {
      title: string;
      description?: string;
      status: string;
      priority: string;
      folderId: string;
      dueDate: string;
      tags?: string[];
    } = req.body;

    // Extract userId from req.user or req.body as appropriate
    const userId = req.body.userId;

    // Example Prisma create
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority as TaskPriority,
        folderId,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        tags: tags ?? [],
        userId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

//update task

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // task id from URL

    const {
      title,
      description,
      priority,
      folderId,
      dueDate,
      tags,
    }: {
      title?: string;
      description?: string;
      priority?: TaskPriority;
      folderId?: string;
      dueDate?: string;
      tags?: string[];
    } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        folderId,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        tags: tags ?? undefined, // leave unchanged if not provided
      },
    });

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update task" });
  }
};
