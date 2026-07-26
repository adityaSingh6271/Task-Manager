"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEvents = listEvents;
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
const eventInput = zod_1.z.object({
    title: zod_1.z.string().trim().min(1).max(250),
    description: zod_1.z.string().max(5000).nullable().optional(),
    startAt: zod_1.z.string().datetime(),
    endAt: zod_1.z.string().datetime(),
    allDay: zod_1.z.boolean().optional(),
    folderId: zod_1.z.string().uuid().nullable().optional(),
});
async function validFolder(folderId, userId) {
    return !folderId || !!await prisma_1.default.folder.findFirst({ where: { id: folderId, userId }, select: { id: true } });
}
async function listEvents(req, res) {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    const events = await prisma_1.default.event.findMany({ where: { userId }, orderBy: { startAt: "asc" } });
    return res.json(events);
}
async function createEvent(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const parsed = eventInput.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: parsed.error.issues[0].message });
        const data = parsed.data;
        if (new Date(data.endAt) <= new Date(data.startAt))
            return res.status(400).json({ error: "End time must be after start time" });
        if (!await validFolder(data.folderId, userId))
            return res.status(404).json({ error: "Project not found" });
        return res.status(201).json(await prisma_1.default.event.create({ data: { ...data, startAt: new Date(data.startAt), endAt: new Date(data.endAt), userId } }));
    }
    catch {
        return res.status(500).json({ error: "Could not create event" });
    }
}
async function updateEvent(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const parsed = eventInput.partial().safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: parsed.error.issues[0].message });
        const existing = await prisma_1.default.event.findFirst({ where: { id: req.params.id, userId } });
        if (!existing)
            return res.status(404).json({ error: "Event not found" });
        const data = parsed.data;
        if (!await validFolder(data.folderId, userId))
            return res.status(404).json({ error: "Project not found" });
        const startAt = data.startAt ? new Date(data.startAt) : existing.startAt;
        const endAt = data.endAt ? new Date(data.endAt) : existing.endAt;
        if (endAt <= startAt)
            return res.status(400).json({ error: "End time must be after start time" });
        return res.json(await prisma_1.default.event.update({ where: { id: existing.id }, data: { ...data, startAt, endAt } }));
    }
    catch {
        return res.status(500).json({ error: "Could not update event" });
    }
}
async function deleteEvent(req, res) {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    const event = await prisma_1.default.event.findFirst({ where: { id: req.params.id, userId }, select: { id: true } });
    if (!event)
        return res.status(404).json({ error: "Event not found" });
    await prisma_1.default.event.delete({ where: { id: event.id } });
    return res.json({ message: "Event deleted" });
}
