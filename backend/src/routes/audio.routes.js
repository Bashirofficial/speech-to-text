import { Router } from "express";
import {
  uploadAudio,
  getAllTranscriptions,
} from "../controllers/audio.controller.js";
import upload from "../middlewares/multer.middleware.js";
const router = Router();

// Route for uploading Audio files
router.route("/upload").post(upload.single("audio"), uploadAudio);

// Route for fetching all transcriptions
router.route("/transcriptions").get(getAllTranscriptions);

export default router;
