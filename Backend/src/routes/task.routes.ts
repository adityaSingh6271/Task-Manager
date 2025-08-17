//src/routes/task.routes.ts

import { Router } from "express";
import { createTask, updateTask } from "../controllers/task.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router()

router.post("/create", authenticateJWT, createTask);
router.put("/:id", authenticateJWT, updateTask);

export default router;