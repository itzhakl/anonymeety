import React from 'react';

const WaitingScreen: React.FC = () => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">ממתין לפרטנר לשיחה...</h2>
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
    </div>
  );
};

export default WaitingScreen;
