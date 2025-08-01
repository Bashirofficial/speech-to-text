import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    console.log("--- Inside Multer filename function ---");
    console.log("file.originalname:", file.originalname); // Check original name here
    console.log("file.mimetype:", file.mimetype); // Check mimetype here
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export default multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 50 }, // Limit file size to 50MB (adjust as needed)
  fileFilter: (req, file, cb) => {
    // Accept only audio files
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed!"), false);
    }
  },
});
