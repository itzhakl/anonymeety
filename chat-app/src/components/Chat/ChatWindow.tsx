import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';

interface ChatWindowProps {
  socket: any;
  chatId: string;
  userId: string;
  partnerUsername: string;
}

interface Message {
  content: string;
  isUser: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ socket, chatId, userId, partnerUsername }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on('message', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, { content: message, isUser: false }]);
    });

    return () => {
      socket.off('message');
    };
  }, [socket]);

  const sendMessage = (message: string) => {    
    if (message.trim()) {
      socket.emit('send_message', message, chatId, userId);
      setMessages((prevMessages) => [...prevMessages, { content: message, isUser: true }]);
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
      <ChatHeader partnerUsername={partnerUsername} />
      <div className="px-4 py-2">
        <MessageList messages={messages} />
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;