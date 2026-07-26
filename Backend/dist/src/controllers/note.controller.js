"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNotes = listNotes;
exports.createNote = createNote;
exports.updateNote = updateNote;
exports.deleteNote = deleteNote;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
const noteInput = zod_1.z.object({ title: zod_1.z.string().trim().min(1).max(250), content: zod_1.z.string().max(20000).optional(), folderId: zod_1.z.string().uuid().nullable().optional() });
async function validFolder(folderId, userId) { return !folderId || !!await prisma_1.default.folder.findFirst({ where: { id: folderId, userId }, select: { id: true } }); }
async function listNotes(req, res) { const userId = req.user?.userId; if (!userId)
    return res.status(401).json({ error: "Unauthorized" }); return res.json(await prisma_1.default.note.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } })); }
async function createNote(req, res) { try {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    const parsed = noteInput.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.issues[0].message });
    if (!await validFolder(parsed.data.folderId, userId))
        return res.status(404).json({ error: "Project not found" });
    return res.status(201).json(await prisma_1.default.note.create({ data: { ...parsed.data, userId } }));
}
catch {
    return res.status(500).json({ error: "Could not create note" });
} }
async function updateNote(req, res) { try {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    const parsed = noteInput.partial().safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.issues[0].message });
    const note = await prisma_1.default.note.findFirst({ where: { id: req.params.id, userId }, select: { id: true } });
    if (!note)
        return res.status(404).json({ error: "Note not found" });
    if (!await validFolder(parsed.data.folderId, userId))
        return res.status(404).json({ error: "Project not found" });
    return res.json(await prisma_1.default.note.update({ where: { id: note.id }, data: parsed.data }));
}
catch {
    return res.status(500).json({ error: "Could not update note" });
} }
async function deleteNote(req, res) { const userId = req.user?.userId; if (!userId)
    return res.status(401).json({ error: "Unauthorized" }); const note = await prisma_1.default.note.findFirst({ where: { id: req.params.id, userId }, select: { id: true } }); if (!note)
    return res.status(404).json({ error: "Note not found" }); await prisma_1.default.note.delete({ where: { id: note.id } }); return res.json({ message: "Note deleted" }); }
