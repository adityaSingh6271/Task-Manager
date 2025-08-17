// src/routes/folder.routes.ts
import { Router } from "express";
import { getFolders, createFolder, updateFolder } from "../controllers/folder.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router();

router.get("/get",  authenticateJWT, getFolders);
router.post("/create", authenticateJWT,  createFolder);
router.put("/:id", authenticateJWT, updateFolder);

export default router;
