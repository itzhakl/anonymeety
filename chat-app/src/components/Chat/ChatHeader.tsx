import React from 'react';
import { FaUser } from 'react-icons/fa';

interface ChatHeaderProps {
  partnerUsername: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ partnerUsername }) => {
  return (
    <div className="flex items-center p-4 bg-gray-100 rounded-t-lg">
      <FaUser className="w-8 h-8 text-gray-600 mr-2" />
      <span className="font-semibold text-lg">{partnerUsername}</span>
    </div>
  );
};

export default ChatHeader;