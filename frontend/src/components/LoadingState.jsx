import React from 'react';

const LoadingState = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <p className="text-white">Processing your audio... This may take a moment.</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;