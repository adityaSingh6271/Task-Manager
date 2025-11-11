import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const JWT_SECRET = process.env.JWT_SECRET;

// ------------------- Validation Schemas -------------------
const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  mobile: z
    .string()
    .min(8, "Mobile number must be at least 8 digits")
    .max(15, "Mobile number too long")
    .regex(/^\+?[0-9]+$/, "Mobile must contain only digits and optional +"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password too long"),
  name: z.string().max(100, "Name too long").optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const emailSchema = z.object({
  email: z.string().email("Invalid email format"),
});

// ------------------- Register -------------------
export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({ error: parsed.error.issues.map((e) => e.message) });

    const { email, mobile, password, name } = parsed.data;

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
        createdAt: true,
      },
    });

    return res.status(201).json({ message: "Account created", user });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------- Password Login -------------------
export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({ error: parsed.error.issues.map((e) => e.message) });

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    if (!JWT_SECRET || typeof JWT_SECRET !== "string")
      return res.status(500).json({ error: "JWT secret is not configured" });

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

// ------------------- OTP Helpers -------------------
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 min

// ------------------- Send OTP -------------------
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const parsed = emailSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ error: parsed.error.issues[0].message });

    const { email } = parsed.data;
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    await prisma.oTP.upsert({
      where: { email: email },
      update: { otp, expiresAt },
      create: { email, otp, expiresAt },
    });

    // Send email via Resend
    await resend.emails.send({
      from: "Jarvis <onboarding@resend.dev>",
      to: [email],
      subject: "Your Jarvis Login OTP",
      html: `<p>Your one-time password is <strong>${otp}</strong>.</p><p>This code will expire in 10 minutes.</p>`,
    });

    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

// ------------------- Verify OTP -------------------
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      otp: z.string().length(6),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ error: parsed.error.issues[0].message });

    const { email, otp } = parsed.data;

    const record = await prisma.oTP.findUnique({ where: { email } });
    if (!record || record.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    if (record.expiresAt < new Date())
      return res.status(400).json({ error: "OTP expired" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    await prisma.oTP.delete({ where: { email } });

    // Generate JWT on successful OTP login
    if (!JWT_SECRET)
      return res.status(500).json({ error: "Missing JWT secret" });
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.json({
      message: "OTP verified successfully",
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to verify OTP" });
  }
};

// ------------------- Resend OTP -------------------
export const resendOtp = async (req: Request, res: Response) => {
  try {
    const parsed = emailSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ error: parsed.error.issues[0].message });

    const { email } = parsed.data;
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    await prisma.oTP.upsert({
      where: { email: email },
      update: { otp, expiresAt },
      create: { email, otp, expiresAt },
    });

    await resend.emails.send({
      from: "Jarvis <onboarding@resend.dev>",
      to: [email],
      subject: "Your Jarvis OTP (Resent)",
      html: `<p>Your new OTP is <strong>${otp}</strong>.</p><p>This code will expire in 10 minutes.</p>`,
    });

    return res.json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to resend OTP" });
  }
};
