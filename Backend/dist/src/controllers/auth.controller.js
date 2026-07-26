"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOtp = exports.verifyOtp = exports.sendOtp = exports.login = exports.register = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const JWT_SECRET = process.env.JWT_SECRET;
// ------------------- Validation Schemas -------------------
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    // mobile: z
    //   .string()
    //   .min(8, "Mobile number must be at least 8 digits")
    //   .max(15, "Mobile number too long")
    //   .regex(/^\+?[0-9]+$/, "Mobile must contain only digits and optional +"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password too long"),
    name: zod_1.z.string().max(100, "Name too long").optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
const emailSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
});
// ------------------- Register -------------------
const register = async (req, res) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success)
            return res
                .status(400)
                .json({ error: parsed.error.issues.map((e) => e.message) });
        const { email, password, name } = parsed.data;
        const existByEmail = await prisma_1.default.user.findUnique({ where: { email } });
        if (existByEmail)
            return res.status(400).json({ error: "Email already registered" });
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: { email, password: hashed, name: name ?? "" },
            select: {
                id: true,
                email: true,
                mobile: true,
                name: true,
                createdAt: true,
            },
        });
        return res.status(201).json({ message: "Account created", user });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.register = register;
// ------------------- Password Login -------------------
const login = async (req, res) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success)
            return res
                .status(400)
                .json({ error: parsed.error.issues.map((e) => e.message) });
        const { email, password } = parsed.data;
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(400).json({ error: "Invalid credentials" });
        const ok = await bcryptjs_1.default.compare(password, user.password);
        if (!ok)
            return res.status(400).json({ error: "Invalid credentials" });
        if (!JWT_SECRET || typeof JWT_SECRET !== "string")
            return res.status(500).json({ error: "JWT secret is not configured" });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "24h",
        });
        return res.json({
            message: "Login successful",
            token,
            user: { id: user.id, email: user.email, name: user.name },
        });
    }
    catch {
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.login = login;
// ------------------- OTP Helpers -------------------
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 min
// ------------------- Send OTP -------------------
const sendOtp = async (req, res) => {
    try {
        // 1. Validate input
        const parsed = emailSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues[0].message });
        }
        const { email } = parsed.data;
        // 2. Generate & save OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
        await prisma_1.default.otp.upsert({
            where: { email },
            update: { otp, expiresAt },
            create: { email, otp, expiresAt },
        });
        // 3. Send OTP email
        const { data, error } = await resend.emails.send({
            from: "Jarvis <onboarding@resend.dev>", // replace after domain verify
            to: [email],
            subject: "Your Jarvis Login OTP",
            html: `<p>Your one-time password is <strong>${otp}</strong>.</p>
             <p>This code will expire in 10 minutes.</p>`,
        });
        if (error) {
            console.error("RESEND ERROR:", error);
            return res.status(500).json({ error: "Failed to send OTP email" });
        }
        return res.json({ message: "OTP sent successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to send OTP" });
    }
};
exports.sendOtp = sendOtp;
// ------------------- Verify OTP -------------------
const verifyOtp = async (req, res) => {
    try {
        // 1. Validate
        const schema = zod_1.z.object({
            email: zod_1.z.string().email(),
            otp: zod_1.z.string().length(6),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues[0].message });
        }
        const { email, otp } = parsed.data;
        // 2. Fetch OTP from DB
        const record = await prisma_1.default.otp.findUnique({ where: { email } });
        if (!record || record.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }
        // 3. Check expiration
        if (record.expiresAt < new Date()) {
            return res.status(400).json({ error: "OTP expired" });
        }
        // 4. Find user
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // 5. Remove OTP (one-time use)
        await prisma_1.default.otp.delete({ where: { email } });
        // 6. Generate JWT
        if (!JWT_SECRET) {
            return res.status(500).json({ error: "JWT secret missing" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "24h",
        });
        return res.json({
            message: "OTP verified successfully",
            token,
            user: { id: user.id, email: user.email, name: user.name },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to verify OTP" });
    }
};
exports.verifyOtp = verifyOtp;
// ------------------- Resend OTP -------------------
const resendOtp = async (req, res) => {
    try {
        const parsed = emailSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues[0].message });
        }
        const { email } = parsed.data;
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
        await prisma_1.default.otp.upsert({
            where: { email },
            update: { otp, expiresAt },
            create: { email, otp, expiresAt },
        });
        const { error } = await resend.emails.send({
            from: "Jarvis <onboarding@resend.dev>",
            to: [email],
            subject: "Your Jarvis OTP (Resent)",
            html: `<p>Your new OTP is <strong>${otp}</strong>.</p>`,
        });
        if (error) {
            console.error("RESEND ERROR:", error);
            return res.status(500).json({ error: "Failed to send email" });
        }
        return res.json({ message: "OTP resent successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to resend OTP" });
    }
};
exports.resendOtp = resendOtp;
