import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import { ApiError } from "./src/utils/ApiError.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from your frontend origin
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Show stack trace only in development
    });
  }

  // Default error response for unexpected errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Import routes
import audioRouter from "./src/routes/audio.routes.js";

// Declare routes
app.use("/api/v1/audio", audioRouter); // Prefix all audio-related routes with /api/v1/audio

// Basic root route
app.get("/", (req, res) => {
  res.send("Speech-to-Text Backend is running! Access API at /api/v1/audio");
});

export { app };
