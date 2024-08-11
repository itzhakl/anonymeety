import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  socket: any;
  chatId: string;
  userId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ socket, chatId, userId }) => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    setMessages(['פרטנר התחבר לשיחה. אפשר להתחיל לדבר!']);

    socket.on('message', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, [socket]);

  const sendMessage = (message: string) => {    
    if (message.trim()) {
      socket.emit('send_message', message, chatId, userId);
      setMessages((prevMessages) => [...prevMessages, `אתה: ${message}`]);
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <MessageList messages={messages} />
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatWindow;
