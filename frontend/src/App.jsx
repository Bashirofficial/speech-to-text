import React from "react";
import Header from "./components/Header";
import RecordingSection from "./components/RecordingSection";
import FileUploadSection from "./components/FileUploadSection";
import LoadingState from "./components/LoadingState";
import TranscriptionHistory from "./components/TranscriptionHistory";
import useAudioRecording from "./hooks/useAudioRecording";
import useFileUpload from "./hooks/useFileUpload";
import useTranscription from "./hooks/useTranscription";

function App() {
  const {
    transcriptions,
    isLoading,
    error,
    currentlyPlaying,
    handleTranscription,
    toggleAudioPlayback,
    deleteTranscription,
    downloadTranscription,
  } = useTranscription();

  const {
    isRecording,
    isPaused,
    recordingTime,
    startRecording,
    stopRecording,
    pauseRecording,
  } = useAudioRecording(handleTranscription);

  const { dragActive, handleFileUpload, handleDrag, handleDrop } =
    useFileUpload(handleTranscription);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Header />

        {/* Main Controls */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8">
              <RecordingSection
                isRecording={isRecording}
                isPaused={isPaused}
                recordingTime={recordingTime}
                startRecording={startRecording}
                pauseRecording={pauseRecording}
                stopRecording={stopRecording}
              />

              <FileUploadSection
                handleFileUpload={handleFileUpload}
                dragActive={dragActive}
                handleDrag={handleDrag}
                handleDrop={handleDrop}
              />
            </div>
          </div>
        </div>

        <LoadingState isLoading={isLoading} />
        {error && ( // <-- Display error message
          <div className="max-w-4xl mx-auto mb-4 p-4 bg-red-600 text-white rounded-lg text-center">
            <p>{error}</p>
          </div>
        )}

        <TranscriptionHistory
          transcriptions={transcriptions}
          currentlyPlaying={currentlyPlaying}
          toggleAudioPlayback={toggleAudioPlayback}
          downloadTranscription={downloadTranscription}
          deleteTranscription={deleteTranscription}
        />
      </div>
    </div>
  );
}

export default App;
