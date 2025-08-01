import React from 'react';

const Header = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Speech to Text
      </h1>
      <p className="text-xl text-gray-300">
        Record audio or upload files to get instant transcriptions
      </p>
    </div>
  );
};

export default Header;