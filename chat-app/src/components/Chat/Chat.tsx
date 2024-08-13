import React from 'react';
import { useAuth, useSocket, useChatState } from '../../hooks';
import ChatButton from './ChatButton';
import LogoutButton from '../LogoutButton';
import { ChatState } from '../../types';

// Assume WaitingScreen and ChatWindow are also in this directory
import WaitingScreen from '../WaitingScreen';
import ChatWindow from './ChatWindow';

const Chat: React.FC = () => {
  const { user, logout } = useAuth();
  const socket = useSocket(user);
  const { chatState, chatId, partnerUsername, startChat, endChat } = useChatState(socket);

  if (!user) {
    return <div>טוען...</div>;
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl mb-4 text-center">ברוך הבא, {user.username}!</h1>
      <ChatButton 
        chatState={chatState} 
        onStart={() => startChat(user.id)} 
        onEnd={() => endChat(user.id)} 
      />
      {chatState === ChatState.Waiting ? <WaitingScreen /> :
        chatState === ChatState.Chatting && chatId && partnerUsername && (
          <ChatWindow
            socket={socket}
            chatId={chatId}
            userId={user.id}
            partnerUsername={partnerUsername}
          />
        )}
      <LogoutButton onClick={logout} />
    </div>
  );
};

export default Chat;