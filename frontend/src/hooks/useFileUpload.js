import { useState } from "react";

const useFileUpload = (onTranscriptionComplete) => {
  const [dragActive, setDragActive] = useState(false);

  // This function is now specifically for processing a single File object
  const processFile = (file) => {
    if (file && file.type.startsWith("audio/")) {
      onTranscriptionComplete(file, file.name);
    } else {
      alert("Please select only audio files.");
    }
  };

  // This function handles the onChange event from the file input
  // It expects the native event object from the input
  const handleFileInputChange = (event) => {
    // Add a check for event and event.target to prevent the TypeError
    if (
      event &&
      event.target &&
      event.target.files &&
      event.target.files.length > 0
    ) {
      processFile(event.target.files[0]); // Process only the first selected file
    } else {
      console.error(
        "No files found in event.target.files or event object is invalid."
      );
      // Optionally, set an error state here if you want to display it to the user
    }
  };

  // This function handles multiple files from drag-and-drop
  const handleDropFiles = (files) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("audio/")) {
        onTranscriptionComplete(file, file.name);
      } else {
        alert("Please select only audio files.");
      }
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleDropFiles(e.dataTransfer.files);
    }
  };

  return {
    dragActive,
    handleFileUpload: handleFileInputChange, // This is the name exported by the hook
    handleDrag,
    handleDrop,
  };
};
export default useFileUpload;
