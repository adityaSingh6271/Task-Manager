"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const twilio_1 = __importDefault(require("twilio"));
const client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
(async () => {
    const messages = await client.messages.list({ limit: 5 });
    console.log(messages.map(m => ({
        to: m.to,
        status: m.status,
        body: m.body,
        error: m.errorMessage
    })));
})();
