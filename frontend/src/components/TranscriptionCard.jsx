import React from "react";
import { Play, Pause, Download, Trash2 } from "lucide-react";

const TranscriptionCard = ({
  transcription,
  currentlyPlaying,
  toggleAudioPlayback,
  downloadTranscription,
  deleteTranscription,
}) => {
  const {
    id,
    originalFileName,
    transcribedText,
    audioFilePath, // This is the path on the backend server
    createdAt,
  } = transcription;
  // --- DEBUG LOG START ---
  console.log("TranscriptionCard received prop:", transcription);
  console.log("originalFileName:", originalFileName);
  console.log("createdAt:", createdAt);
  console.log("transcribedText:", transcribedText);
  // --- DEBUG LOG END ---

  const isPlaying = currentlyPlaying === id;

  // Format the date for display
  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl text-white">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-purple-200 break-all pr-4">
          {originalFileName || "Untitled Audio"}
        </h3>
        <span className="text-sm text-gray-400">{formattedDate}</span>
      </div>

      <div className="mb-4 text-gray-200">
        <p className="font-medium text-lg mb-2">Transcription:</p>
        <p className="bg-white/5 p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
          {transcribedText || "No transcription available yet."}
        </p>
      </div>

      <div className="flex items-center justify-between mt-6">
        {/* Play/Pause Button */}
        <button
          onClick={() => toggleAudioPlayback(id, audioFilePath)}
          className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 transition duration-200 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          title={isPlaying ? "Pause Audio" : "Play Audio"}
          disabled={!audioFilePath} // Disable if no audio file path
        >
          {isPlaying ? (
            <Pause size={20} className="text-white" />
          ) : (
            <Play size={20} className="text-white" />
          )}
        </button>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => downloadTranscription(transcription)}
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition duration-200 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download Transcription"
            disabled={
              !transcribedText ||
              transcribedText.includes("Transcription in progress") ||
              transcribedText.includes("Transcription failed")
            }
          >
            <Download size={20} className="text-white" />
          </button>
          <button
            onClick={() => deleteTranscription(id)}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition duration-200 ease-in-out shadow-md"
            title="Delete Transcription"
          >
            <Trash2 size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionCard;
