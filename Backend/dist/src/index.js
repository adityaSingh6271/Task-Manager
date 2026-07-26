"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const folder_routes_1 = __importDefault(require("./routes/folder.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const note_routes_1 = __importDefault(require("./routes/note.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/profile", profile_routes_1.default);
app.use("/api/folders", folder_routes_1.default);
app.use("/api/tasks", task_routes_1.default);
app.use("/api/events", event_routes_1.default);
app.use("/api/notes", note_routes_1.default);
app.get("/", (req, res) => {
    res.send("Backend server is running!");
});
app.use("/api/auth", auth_routes_1.default);
if (process.env.NODE_ENV !== "production") {
    app.listen(5000, () => console.log("Server running on http://localhost:5000"));
}
exports.default = app;
