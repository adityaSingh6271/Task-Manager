import express from "express";
import { register, login, sendOtp, verifyOtp } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/otp/send", sendOtp);
router.post("/otp/verify", verifyOtp);

export default router;
