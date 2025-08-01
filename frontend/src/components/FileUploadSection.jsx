import React, { useRef } from "react";
import { Upload, FileAudio } from "lucide-react";

const FileUploadSection = ({
  handleFileUpload,
  dragActive,
  handleDrag,
  handleDrop,
}) => {
  const fileInputRef = useRef(null);

  return (
    <div className="text-center">
      <h3 className="text-2xl font-semibold text-white mb-6">
        Upload Audio File
      </h3>

      <div
        className={`border-2 border-dashed ${
          dragActive ? "border-blue-400 bg-blue-400/10" : "border-gray-400"
        } rounded-2xl p-8 transition-all cursor-pointer hover:border-blue-400 hover:bg-blue-400/5`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <FileAudio size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-white mb-2">
          {dragActive
            ? "Drop your audio file here"
            : "Drag & drop your audio file here"}
        </p>
        <p className="text-gray-400 text-sm mb-4">or</p>
        <button className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition-all transform hover:scale-105">
          <Upload size={20} />
          Choose File
        </button>
        <p className="text-gray-400 text-xs mt-2">
          Supports MP3, WAV, M4A, OGG
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default FileUploadSection;
