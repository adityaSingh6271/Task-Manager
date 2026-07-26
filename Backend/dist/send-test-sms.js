"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// send-test-sms.ts
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
async function main() {
    try {
        const message = await client.messages.create({
            body: "Hello from Twilio test script 🚀",
            from: process.env.TWILIO_PHONE_NUMBER,
            to: "+18777804236", // <-- replace with your verified number in E.164 format
        });
        console.log("✅ Message sent!");
        console.log("SID:", message.sid);
    }
    catch (err) {
        console.error("❌ Failed to send message:", err);
    }
}
main();
