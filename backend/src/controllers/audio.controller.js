import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import prisma from "../db/index.js";
import { createClient } from "@deepgram/sdk";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url"; // For __dirname equivalent in ES Modules

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
if (!DEEPGRAM_API_KEY) {
  console.error("DEEPGRAM_API_KEY is not set in environment variables.");
  // In a production app, you might want to throw an error or handle this more robustly.
}
const deepgram = createClient(DEEPGRAM_API_KEY);

const transcribeAudio = async (filePath) => {
  try {
    const audioBuffer = fs.readFileSync(filePath);
    let mimeType = "audio/webm";
    if (filePath.endsWith(".mp3")) mimeType = "audio/mpeg";
    else if (filePath.endsWith(".wav")) mimeType = "audio/wav";
    else if (filePath.endsWith(".ogg")) mimeType = "audio/ogg";

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        mimetype: mimeType,
        smart_format: true,
        punctuate: true,
        model: "nova-2",
      }
    );

    if (error) {
      console.error("Deepgram transcription error:", error);
      throw new Error(`Deepgram API Error: ${error.message}`);
    }

    const transcript = result.results?.channels[0]?.alternatives[0]?.transcript;

    if (!transcript) {
      throw new Error("No transcript found in Deepgram response.");
    }

    return transcript;
  } catch (deepgramError) {
    console.error("Error during Deepgram transcription:", deepgramError);
    throw new ApiError(
      500,
      `Speech-to-Text API failed: ${deepgramError.message}`
    );
  }
};

const uploadAudio = asyncHandler(async (req, res) => {
  // --- DEBUG LOGS START ---
  console.log("--- Inside uploadAudio controller ---");
  console.log("req.file:", req.file); // Check if multer populated req.file

  if (!req.file) {
    console.error("No audio file uploaded. req.file is undefined.");
    throw new ApiError(400, "No audio file uploaded.");
  }

  const audioFilePath = req.file.path;
  const originalFileName = req.file.originalname; // This should be the actual file name
  const mimeType = req.file.mimetype;
  const fileSize = req.file.size;

  console.log("Extracted originalFileName:", originalFileName);
  console.log("Extracted mimeType:", mimeType);
  console.log("Extracted fileSize:", fileSize);
  // --- DEBUG LOGS END ---

  const newTranscription = await prisma.transcription.create({
    data: {
      audioFilePath: audioFilePath,
      transcribedText: "Transcription in progress...",
      originalFileName: originalFileName,
      mimeType: mimeType,
      fileSize: fileSize,
    },
  });

  transcribeAudio(audioFilePath)
    .then(async (transcriptionResult) => {
      await prisma.transcription.update({
        where: { id: newTranscription.id },
        data: { transcribedText: transcriptionResult },
      });
      console.log(
        `Transcription for ${originalFileName} (ID: ${newTranscription.id}) completed and updated.`
      );
    })
    .catch(async (error) => {
      console.error(
        `Error transcribing ${originalFileName} (ID: ${newTranscription.id}):`,
        error
      );
      await prisma.transcription.update({
        where: { id: newTranscription.id },
        data: { transcribedText: `Transcription failed: ${error.message}` },
      });
    });

  return res.status(202).json(
    new ApiResponse(
      202,
      {
        transcriptionId: newTranscription.id,
        originalFileName: originalFileName,
        message: "Audio uploaded. Transcription is being processed.",
      },
      "Audio uploaded successfully, transcription pending."
    )
  );
});

const getAllTranscriptions = asyncHandler(async (req, res) => {
  // Fetch all transcriptions from Supabase using Prisma
  const transcriptions = await prisma.transcription.findMany({
    orderBy: {
      createdAt: "desc", // Order by creation date, newest first
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transcriptions,
        "Transcriptions fetched successfully"
      )
    );
});

export { uploadAudio, getAllTranscriptions };
