"use strict";
// src/controllers/folder.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolder = exports.updateFolder = exports.createFolder = exports.getFolders = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
//Get all Folders
const getFolders = async (req, res) => {
    try {
        if (!req.user?.userId)
            return res.status(401).json({ error: "Unauthorized" });
        const folders = await prisma_1.default.folder.findMany({ where: { userId: req.user.userId }, include: { tasks: true } });
        res.json(folders);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch folders" });
    }
};
exports.getFolders = getFolders;
//create folder
const createFolder = async (req, res) => {
    try {
        const { name, color } = req.body;
        const userId = req.user?.userId;
        if (!name || !userId) {
            return res.status(400).json({ error: "Name is required" });
        }
        const folder = await prisma_1.default.folder.create({
            data: {
                name,
                color: color ?? "#000000",
                userId,
            },
        });
        console.log("create folder:", folder);
        res.status(201).json(folder);
    }
    catch (error) {
        console.error("Error creating folder:", error);
        res.status(500).json({ error: "Failed to create folder" });
    }
};
exports.createFolder = createFolder;
// update folder
const updateFolder = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color } = req.body;
        if (!id) {
            return res.status(400).json({ error: "Folder ID is required" });
        }
        if (!req.user?.userId)
            return res.status(401).json({ error: "Unauthorized" });
        const existing = await prisma_1.default.folder.findFirst({ where: { id, userId: req.user.userId } });
        if (!existing)
            return res.status(404).json({ error: "Project not found" });
        const folder = await prisma_1.default.folder.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(color && { color }),
            },
        });
        res.json(folder);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update folder" });
    }
};
exports.updateFolder = updateFolder;
// delete folder
const deleteFolder = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Folder ID is required" });
        }
        if (!req.user?.userId)
            return res.status(401).json({ error: "Unauthorized" });
        const existing = await prisma_1.default.folder.findFirst({ where: { id, userId: req.user.userId } });
        if (!existing)
            return res.status(404).json({ error: "Project not found" });
        // Keep deletion reliable before/after the cascade migration is deployed.
        // The UI always asks for explicit confirmation because these tasks are permanent.
        const [, folder] = await prisma_1.default.$transaction([
            prisma_1.default.task.deleteMany({ where: { folderId: id } }),
            prisma_1.default.folder.delete({ where: { id } }),
        ]);
        res.json({ message: "Folder deleted successfully", folder });
    }
    catch (error) {
        console.error("Error deleting folder:", error);
        if (error.code === "P2025") {
            // Prisma not found error
            return res.status(404).json({ error: "Folder not found" });
        }
        res.status(500).json({ error: "Failed to delete folder" });
    }
};
exports.deleteFolder = deleteFolder;
