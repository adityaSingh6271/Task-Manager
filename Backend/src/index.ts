import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes"
import profileRoutes from "./routes/profile.routes";

const app = express();
app.use(cors());

app.use("/api/profile", profileRoutes);

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));