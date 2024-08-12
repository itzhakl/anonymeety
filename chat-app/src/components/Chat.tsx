import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import ChatWindow from './ChatWindow';
import WaitingScreen from './WaitingScreen';

enum ChatState {
  Idle = 'idle',
  Waiting = 'waiting',
  Chatting = 'chatting',
}

interface User {
  id: string;
  username: string;
}

const Chat: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatState, setChatState] = useState<ChatState>(ChatState.Idle);
  const [chatId, setChatId] = useState<string | null>(null);
  const [partnerUsername, setPartnerUsername] = useState<string | null>(null);

  const navigate = useNavigate();

  const connectSocket = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
    const newSocket = io('http://localhost:3001', {
      auth: { token }
    });
    
    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
      // כאן אפשר להוסיף לוגיקה לטיפול בשגיאת התחברות, למשל ניתוב חזרה לדף ההתחברות
      navigate('/');
    });

    setSocket(newSocket);
    return newSocket;
  }, [navigate]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const socket = connectSocket();
    socket.emit('join', user.id, user.username);

    const handleWaiting = () => setChatState(ChatState.Waiting);
    const handleChatStarted = (newChatId: string, newPartnerUsername: string) => {
      setChatState(ChatState.Chatting);
      setChatId(newChatId);
      setPartnerUsername(newPartnerUsername);
    };

    const handleChatEnded = () => {
      setChatState(ChatState.Idle);
      setChatId(null);
      setPartnerUsername(null);
    }

    const handlePartnerDisconnected = () => {
      setChatState(ChatState.Waiting);
      setChatId(null);
      setPartnerUsername(null);
      alert('the partner has disconnected we looking for new partner');
    };

    socket.on('waiting', handleWaiting);
    socket.on('chat_started', handleChatStarted);
    socket.on('chat_ended', handleChatEnded);
    socket.on('partner_disconnected', handlePartnerDisconnected);
    
    return () => {
      socket.off('waiting', handleWaiting);
      socket.off('chat_started', handleChatStarted);
      socket.off('chat_ended', handleChatEnded);
      socket.off('partner_disconnected', handlePartnerDisconnected);
      socket.disconnect();
    };
  }, [user, connectSocket]);

  const startChat = () => {
    if (user && socket) {
      socket.emit('start_chat', user.id);
    } else {
      console.error('User or socket not found');
    }
  };

  const endChat = () => {
    if (socket) {
      if (chatId) {
        socket.emit('end_chat', chatId)
      } else {
        socket.emit('end_chat', chatId, user?.id);
      }
    } else {
      navigate('/');
    }
    setChatId(null);
    setPartnerUsername(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    if (socket) {
      socket.disconnect();
    }
    setSocket(null);
    setUser(null);
    navigate('/');
  };

  if (!user) {
    return <div>טוען...</div>;
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl mb-4 text-center">ברוך הבא, {user.username}!</h1>
      <ChatButton chatState={chatState} onStart={startChat} onEnd={endChat} />
      {chatState === ChatState.Waiting ? <WaitingScreen /> :
            chatState === ChatState.Chatting && chatId && partnerUsername && (
        <ChatWindow
          socket={socket}
          chatId={chatId}
          userId={user.id}
          partnerUsername={partnerUsername}
        />
      )}
      <LogoutButton onClick={handleLogout} />
    </div>
  );
};

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

const LogoutButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full mt-4"
    onClick={onClick}
  >
    התנתק
  </button>
);

export default Chat;
