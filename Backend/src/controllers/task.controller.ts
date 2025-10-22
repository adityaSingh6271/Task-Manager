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
      status,
    }: {
      title?: string;
      description?: string;
      priority?: TaskPriority;
      folderId?: string;
      dueDate?: string;
      tags?: string[];
      status?: "PENDING" | "COMPLETED";
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
        status
      },
    });

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update task" });
  }
};


// Delete task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // task id from URL

    // Delete by ID
    await prisma.task.delete({
      where: { id },
    });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error: any) {
    console.error(error);

    // Prisma throws a specific error if record not found
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(500).json({ error: "Failed to delete task" });
  }
};
