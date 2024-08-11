import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import ChatWindow from './ChatWindow';
import WaitingScreen from './WaitingScreen';

const socket = io('http://localhost:3001');

const Chat: React.FC = () => {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [chatState, setChatState] = useState<'idle' | 'waiting' | 'chatting'>('idle');
  const [chatId, setChatId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      socket.emit('user_connected', user.id);

      socket.on('waiting', () => {
        setChatState('waiting');
      });

      socket.on('chat_started', (newChatId: string) => {
        setChatState('chatting');
        setChatId(newChatId);
      });

      socket.on('partner_disconnected', () => {
        setChatState('idle');
        setChatId(null);
        alert('השותף לצ\'אט התנתק');
      });
    }

    return () => {
      socket.off('waiting');
      socket.off('chat_started');
      socket.off('partner_disconnected');
    };
  }, [user]);

  const startChat = () => {
    if (user) {
      console.log('chat started');

      socket.emit('start_chat', user.id);
    }
  };

  const endChat = () => {
    if (!chatId) {
      setChatState('idle');
      return;
    }
    socket.emit('end_chat', chatId);
    setChatState('waiting');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return <div>טוען...</div>;
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl mb-4 text-center">ברוך הבא, {user.username}!</h1>
      {chatState === 'idle' ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
          onClick={startChat}
        >
          התחל צ'אט
        </button>
      ) : (
        <button
          className="flex justify-center m-2 p-2 bg-orange-500"
          onClick={endChat}>
          סיום שיחה
        </button>
      )}
      {chatState === 'waiting' && <WaitingScreen />}
      {chatState === 'chatting' && chatId && <ChatWindow socket={socket} chatId={chatId} userId={user.id} />}
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full mt-4"
        onClick={handleLogout}
      >
        התנתק
      </button>
    </div>
  );
};

export default Chat;
