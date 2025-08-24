//src/routes/task.routes.ts

import { Router } from "express";
import { createTask, deleteTask, updateTask } from "../controllers/task.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router()

router.post("/create", authenticateJWT, createTask);
router.put("/:id", authenticateJWT, updateTask);
router.delete("/:id", authenticateJWT, deleteTask);

export default router;