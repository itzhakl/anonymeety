import { useState, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { ChatState } from '../types';

export const useChatState = (socket: Socket | null) => {
  const [chatState, setChatState] = useState<ChatState>(ChatState.Idle);
  const [chatId, setChatId] = useState<string | null>(null);
  const [partnerUsername, setPartnerUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

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
    };
    const handlePartnerDisconnected = () => {
      setChatState(ChatState.Waiting);
      setChatId(null);
      setPartnerUsername(null);
      alert('השותף התנתק, אנחנו מחפשים שותף חדש');
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
    };
  }, [socket]);

  const startChat = useCallback((userId: string) => {
    if (socket) {
      socket.emit('start_chat', userId);
    }
  }, [socket]);

  const endChat = useCallback((userId: string) => {
    if (socket) {
      if (chatId) {
        socket.emit('end_chat', chatId);
      } else {
        socket.emit('end_chat', null, userId);
      }
    }
    setChatId(null);
    setPartnerUsername(null);
  }, [socket, chatId]);

  return { chatState, chatId, partnerUsername, startChat, endChat };
};
