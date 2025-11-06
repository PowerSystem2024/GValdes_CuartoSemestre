// src/app.js
import express from "express";
import morgan from "morgan";
import tareasRoutes from "./router/tareas.routes.js";
import authRoutes from "./router/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { pool } from "./db.js";

const app = express();

// ======== Middlewares globales ========
app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true, // permite envío de cookies
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ======== Rutas base ========
app.get("/", (req, res) => res.json({ message: "Bienvenidos a mi proyecto" }));

app.get("/api/ping", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al hacer ping:", error);
    res.status(500).json({ error: "Error al conectar a la base de datos" });
  }
});

// ======== Rutas de API ========
app.use("/api", tareasRoutes);
app.use("/api", authRoutes);

// ======== Manejo global de errores ========
app.use((err, req, res, next) => {
  console.error("Error no manejado:", err);
  res.status(500).json({
    status: "error",
    message: err.message || "Error interno del servidor",
  });
});

export default app;
