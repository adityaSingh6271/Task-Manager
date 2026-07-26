"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfileData = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const zod_1 = require("zod");
const profileInput = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, "Name is required").max(100).optional(),
    avatar: zod_1.z.string().url("Avatar must be a valid URL").nullable().optional(),
});
const getProfileData = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        // Fetch user data
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
            },
        });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // Fetch folders with tasks
        const folders = await prisma_1.default.folder.findMany({
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
    }
    catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getProfileData = getProfileData;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const parsed = profileInput.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: parsed.error.issues[0].message });
        if (!Object.keys(parsed.data).length)
            return res.status(400).json({ error: "No profile changes supplied" });
        const user = await prisma_1.default.user.update({
            where: { id: userId },
            data: parsed.data,
            select: { id: true, name: true, email: true, avatar: true },
        });
        return res.json(user);
    }
    catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({ error: "Could not update profile" });
    }
};
exports.updateProfile = updateProfile;
