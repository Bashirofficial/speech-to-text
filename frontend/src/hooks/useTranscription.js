// hooks/useTranscription.js
import { useState, useEffect, useRef } from "react";
import axios from "axios";

// Use the relative path to leverage Vite's proxy

const API_BASE_URL =
  "https://speech-to-text-backend-production-0c8c.up.railway.app/api/v1/audio";
const useTranscription = () => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // State for displaying errors to the user
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const audioRefs = useRef({}); // To manage audio elements for playback

  // --- Fetch previous transcriptions on component mount ---
  const fetchTranscriptions = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/transcriptions`);
      // Assuming your backend's ApiResponse structure: { success: true, data: [...], message: "..." }
      if (response.data.success) {
        setTranscriptions(response.data.data);
      } else {
        setError(
          response.data.message || "Failed to fetch transcription history."
        );
      }
    } catch (err) {
      console.error("Error fetching transcription history:", err);
      setError(
        err.response?.data?.message ||
          "Failed to connect to backend or fetch history."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTranscriptions();
  }, []); // Fetch on initial mount

  // --- Handle Audio Upload/Recording and Send to Backend ---
  const handleTranscription = async (audioFile, fileName) => {
    setIsLoading(true);
    setError("");

    if (!audioFile) {
      setError("No audio file provided for transcription.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    // 'audio' must match the field name in multer setup on your backend ('upload.single('audio'))
    formData.append("audio", audioFile, fileName);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", response.data);
      if (response.data.success) {
        // The backend responds immediately that transcription is pending (202 Accepted)
        // We'll refetch the history after a short delay to see the updated status
        // For real-time updates, consider WebSockets or long polling.
        setTimeout(() => {
          fetchTranscriptions();
        }, 3000); // Poll after 3 seconds to check for updated transcription
      } else {
        setError(response.data.message || "Transcription request failed.");
      }
    } catch (err) {
      console.error("Error during transcription request:", err);
      setError(
        err.response?.data?.message ||
          "Failed to send audio for transcription. Check backend."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- Audio Playback ---
  const toggleAudioPlayback = (transcriptionId, audioFilePath) => {
    // REPLACED path.basename with browser-compatible string manipulation
    const filename = audioFilePath.split(/[/\\]/).pop(); // Handles both / and \ path separators
    const fullAudioUrl = `${window.location.origin}/uploads/${filename}`;

    const audio = audioRefs.current[transcriptionId] || new Audio(fullAudioUrl);
    audioRefs.current[transcriptionId] = audio;

    if (currentlyPlaying === transcriptionId) {
      audio.pause();
      setCurrentlyPlaying(null);
    } else {
      Object.values(audioRefs.current).forEach((a) => a.pause());

      audio.play();
      setCurrentlyPlaying(transcriptionId);

      audio.onended = () => {
        setCurrentlyPlaying(null);
      };
    }
  };

  // --- Delete Transcription ---
  const deleteTranscription = async (id) => {
    // TODO: Implement backend DELETE route for /api/v1/audio/:id
    // For now, it will only remove from frontend state.
    // try {
    //   await axios.delete(`${API_BASE_URL}/${id}`);
    //   setTranscriptions(prev => prev.filter(t => t.id !== id));
    //   if (audioRefs.current[id]) {
    //     audioRefs.current[id].pause();
    //     delete audioRefs.current[id];
    //   }
    //   if (currentlyPlaying === id) {
    //     setCurrentlyPlaying(null);
    //   }
    // } catch (err) {
    //   console.error('Error deleting transcription:', err);
    //   setError(err.response?.data?.message || 'Failed to delete transcription.');
    // }

    // Mock deletion for now
    setTranscriptions((prev) => prev.filter((t) => t.id !== id));
    if (audioRefs.current[id]) {
      audioRefs.current[id].pause();
      delete audioRefs.current[id];
    }
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null);
    }
    console.warn(
      "Delete functionality is frontend-only. Implement backend DELETE route."
    );
  };

  // --- Download Transcription---
  const downloadTranscription = (transcription) => {
    const element = document.createElement("a");
    // Use the actual transcribed_text from the backend data
    const file = new Blob([transcription.transcribed_text], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `transcription_${
      transcription.original_file_name || "audio"
    }_${new Date(transcription.created_at).toISOString().split("T")[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return {
    transcriptions,
    isLoading,
    error, // Expose error state
    currentlyPlaying,
    handleTranscription,
    toggleAudioPlayback,
    deleteTranscription,
    downloadTranscription,
    fetchTranscriptions, // Expose fetch function if needed by other components
  };
};

export default useTranscription;
