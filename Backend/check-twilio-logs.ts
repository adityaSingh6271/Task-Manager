import "dotenv/config";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

(async () => {
  const messages = await client.messages.list({ limit: 5 });
  console.log(messages.map(m => ({
    to: m.to,
    status: m.status,
    body: m.body,
    error: m.errorMessage
  })));
})();
