import { Router } from "express";
import { createNote, deleteNote, listNotes, updateNote } from "../controllers/note.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
const router = Router();
router.use(authenticateJWT);
router.get("/", listNotes); router.post("/", createNote); router.put("/:id", updateNote); router.delete("/:id", deleteNote);
export default router;
