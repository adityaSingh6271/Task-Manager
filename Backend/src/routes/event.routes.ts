import { Router } from "express";
import { createEvent, deleteEvent, listEvents, updateEvent } from "../controllers/event.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
const router = Router();
router.use(authenticateJWT);
router.get("/", listEvents); router.post("/", createEvent); router.put("/:id", updateEvent); router.delete("/:id", deleteEvent);
export default router;
