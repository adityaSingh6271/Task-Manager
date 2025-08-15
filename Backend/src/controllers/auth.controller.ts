import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import { Request, Response } from "express";
import { sendSms } from "../lib/twilio";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response) => {
  const { email, mobile, password, name } = req.body;

  if (!email || !password || !mobile) {
    return res
      .status(400)
      .json({ error: "email, mobile and password are required" });
  }

  try {
    const existByEmail = await prisma.user.findUnique({ where: { email } });
    if (existByEmail)
      return res.status(400).json({ error: "Email already registered" });

    const existByMobile = await prisma.user.findUnique({ where: { mobile } });
    if (existByMobile)
      return res.status(400).json({ error: "Mobile already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, mobile, password: hashed, name: name ?? "" },
      select: {
        id: true,
        email: true,
        mobile: true,
        name: true,
        avatar: true,
        createdAt: true,
      },
    });

    return res.status(201).json({ message: "Account created", user });
  } catch (err: any) {
    if (err?.code === "P2002")
      return res.status(400).json({ error: "Unique constraint failed" });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    if (!JWT_SECRET || typeof JWT_SECRET !== "string") {
      return res.status(500).json({ error: "JWT secret is not configured" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const sendOtp = async (req: Request, res: Response) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ error: "mobile required" });

  try {
    const otp = String(randomInt(1000, 999999)).padStart(4, "0");

    console.log(`[OTP] Generated OTP ${otp} for ${mobile}`);

    await prisma.oTP.create({ data: { mobile, otp } });
    console.log(`[OTP] Saved OTP in DB for ${mobile}`);

    await sendSms(`+91${mobile}`, `Your OTP code is ${otp}`);
    console.log(`[OTP] SMS sent to ${mobile}`);

    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("OTP send error:", err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp)
    return res.status(400).json({ error: "mobile and otp required" });

  try {
    const record = await prisma.oTP.findFirst({
      where: { mobile, otp },
      orderBy: { createdAt: "desc" }, // newest OTP
    });

    if (!record) {
      console.log(`[OTP] Verification failed for ${mobile} with OTP ${otp}`);
      return res.status(400).json({ error: "Invalid OTP" });
    }

    console.log(`[OTP] Verification success for ${mobile}`);
    return res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("OTP verify error:", err);
    return res.status(500).json({ error: "Failed to verify OTP" });
  }
};
