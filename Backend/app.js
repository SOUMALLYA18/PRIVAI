import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

connectDB();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/projects", projectRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;
