// src/routes/profile.routes.ts
import express from "express";
import { getProfileData } from "../controllers/profile.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/me", authenticateJWT, getProfileData);

export default router;
