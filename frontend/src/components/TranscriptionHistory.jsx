import React from 'react';
import { FileAudio } from 'lucide-react';
import TranscriptionCard from './TranscriptionCard';

const TranscriptionHistory = ({ 
  transcriptions, 
  currentlyPlaying, 
  toggleAudioPlayback, 
  downloadTranscription, 
  deleteTranscription 
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Transcription History
      </h2>
      
      {transcriptions.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 border border-white/10 text-center">
          <FileAudio size={64} className="mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400 text-lg">
            No transcriptions yet. Record or upload audio to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {transcriptions.map((transcription) => (
            <TranscriptionCard
              key={transcription.id}
              transcription={transcription}
              currentlyPlaying={currentlyPlaying}
              toggleAudioPlayback={toggleAudioPlayback}
              downloadTranscription={downloadTranscription}
              deleteTranscription={deleteTranscription}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TranscriptionHistory;