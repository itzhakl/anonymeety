import React from 'react';

interface MessageListProps {
  messages: string[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="mb-4 h-64 overflow-y-auto">
      {messages.map((msg, index) => (
        <div key={index} className="mb-2">
          {msg}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
