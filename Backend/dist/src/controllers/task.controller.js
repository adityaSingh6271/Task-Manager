"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
const taskInput = zod_1.z.object({
    title: zod_1.z.string().trim().min(1).max(250).optional(),
    description: zod_1.z.string().max(5000).nullable().optional(),
    priority: zod_1.z.nativeEnum(client_1.TaskPriority).optional(),
    folderId: zod_1.z.string().uuid().optional(),
    dueDate: zod_1.z.string().datetime().nullable().optional(),
    tags: zod_1.z.array(zod_1.z.string().trim().min(1).max(50)).max(20).optional(),
    status: zod_1.z.nativeEnum(client_1.TaskStatus).optional(),
    isPriority: zod_1.z.boolean().optional(),
    priorityOrder: zod_1.z.number().int().min(1).max(3).nullable().optional(),
});
async function ownedFolder(folderId, userId) {
    return prisma_1.default.folder.findFirst({ where: { id: folderId, userId }, select: { id: true } });
}
const createTask = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const parsed = taskInput.extend({ title: zod_1.z.string().trim().min(1).max(250), folderId: zod_1.z.string().uuid() }).safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: parsed.error.issues[0].message });
        const data = parsed.data;
        if (!await ownedFolder(data.folderId, userId))
            return res.status(404).json({ error: "Project not found" });
        const task = await prisma_1.default.task.create({ data: {
                title: data.title, description: data.description, priority: data.priority ?? client_1.TaskPriority.MEDIUM,
                folderId: data.folderId, dueDate: data.dueDate ? new Date(data.dueDate) : null, tags: data.tags ?? [], userId,
                isPriority: data.isPriority ?? false, priorityOrder: data.isPriority ? data.priorityOrder ?? 3 : null,
            } });
        return res.status(201).json(task);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to create task" });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const parsed = taskInput.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: parsed.error.issues[0].message });
        const task = await prisma_1.default.task.findFirst({ where: { id: req.params.id, userId }, select: { id: true } });
        if (!task)
            return res.status(404).json({ error: "Task not found" });
        const data = parsed.data;
        if (data.folderId && !await ownedFolder(data.folderId, userId))
            return res.status(404).json({ error: "Project not found" });
        const updated = await prisma_1.default.task.update({ where: { id: task.id }, data: {
                ...data, dueDate: data.dueDate === undefined ? undefined : data.dueDate ? new Date(data.dueDate) : null,
                priorityOrder: data.isPriority === false ? null : data.priorityOrder,
            } });
        return res.json(updated);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update task" });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const task = await prisma_1.default.task.findFirst({ where: { id: req.params.id, userId }, select: { id: true } });
        if (!task)
            return res.status(404).json({ error: "Task not found" });
        await prisma_1.default.task.delete({ where: { id: task.id } });
        return res.json({ message: "Task deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to delete task" });
    }
};
exports.deleteTask = deleteTask;
