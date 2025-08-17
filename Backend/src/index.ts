import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import folderRoutes from "./routes/folder.routes";
import taskRoutes from "./routes/task.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/profile", profileRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
