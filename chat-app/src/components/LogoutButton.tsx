import React from 'react';

interface LogoutButtonProps {
  onClick: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick }) => (
  <button
    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full mt-4"
    onClick={onClick}
  >
    התנתק
  </button>
);
