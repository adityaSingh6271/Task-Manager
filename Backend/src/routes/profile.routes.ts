// src/routes/profile.routes.ts
import express from "express";
import { getProfileData, updateProfile } from "../controllers/profile.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/me", authenticateJWT, getProfileData);
router.put("/me", authenticateJWT, updateProfile);

export default router;
