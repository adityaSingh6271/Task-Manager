import express from "express";
import {
  register,
  login,
  sendOtp,
  verifyOtp,
  resendOtp,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

export default router;
