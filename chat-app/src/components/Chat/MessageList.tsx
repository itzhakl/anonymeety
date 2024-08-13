import React, { useRef, useEffect } from 'react';

interface Message {
  content: string;
  isUser: boolean;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="mb-4 h-64 overflow-y-auto">
      {messages.map((msg, index) => (
        <div 
          key={index} 
          className={`mb-2 p-2 rounded-lg max-w-[70%] ${
            msg.isUser 
              ? 'bg-green-500 text-white self-end ml-auto' 
              : 'bg-blue-200 text-black self-start mr-auto'
          }`}
        >
          {msg.content}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;