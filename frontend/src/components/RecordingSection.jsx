import React from 'react';
import { Mic, Pause, Square } from 'lucide-react';

const RecordingSection = ({ 
  isRecording, 
  isPaused, 
  recordingTime, 
  startRecording, 
  pauseRecording, 
  stopRecording 
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-semibold text-white mb-6">Record Audio</h3>
      
      {/* Recording Timer */}
      {isRecording && (
        <div className="mb-6 p-4 bg-red-500/20 rounded-2xl border border-red-500/30">
          <div className="flex items-center justify-center gap-2 text-red-400 text-lg font-mono">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            {formatTime(recordingTime)}
          </div>
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex justify-center gap-4 mb-6">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95"
          >
            <Mic size={24} />
          </button>
        ) : (
          <>
            <button
              onClick={pauseRecording}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white p-4 rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95"
            >
              {isPaused ? <Mic size={24} /> : <Pause size={24} />}
            </button>
            <button
              onClick={stopRecording}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-4 rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95"
            >
              <Square size={24} />
            </button>
          </>
        )}
      </div>

      <p className="text-gray-300 text-sm">
        {!isRecording 
          ? "Click the microphone to start recording" 
          : isPaused 
            ? "Recording paused" 
            : "Recording in progress..."}
      </p>
    </div>
  );
};

export default RecordingSection;