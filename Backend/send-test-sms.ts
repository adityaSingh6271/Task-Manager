// send-test-sms.ts
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

async function main() {
  try {
    const message = await client.messages.create({
      body: "Hello from Twilio test script 🚀",
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: "+18777804236", // <-- replace with your verified number in E.164 format
    });

    console.log("✅ Message sent!");
    console.log("SID:", message.sid);
  } catch (err) {
    console.error("❌ Failed to send message:", err);
  }
}

main();
