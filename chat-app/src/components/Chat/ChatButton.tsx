import React from 'react';
import { ChatState } from '../../types';

interface ChatButtonProps {
  chatState: ChatState;
  onStart: () => void;
  onEnd: () => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ chatState, onStart, onEnd }) => {
  const isIdle = chatState === ChatState.Idle;
  const buttonClass = isIdle
    ? 'bg-blue-500 hover:bg-blue-700'
    : 'bg-orange-500 hover:bg-orange-700';
  const buttonText = isIdle ? 'התחל צ\'אט' : 'סיום שיחה';
  const onClick = isIdle ? onStart : onEnd;

  return (
    <button
      className={`${buttonClass} text-white font-bold py-2 px-4 rounded w-full mb-4`}
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
};

export default ChatButton;
