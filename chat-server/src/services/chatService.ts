import { KeyObject } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export interface ActiveUser {
  id: string;
  socketId: string;
  chatId?: string;
  username?: string;
}

export interface WaitingUser {
  userId: string;
  socketId: string;
}

export interface Chat {
  id: string;
  participants: WaitingUser[];
}

const activeUsers: ActiveUser[] = [];
const waitingUsers: WaitingUser[] = [];
const activeChats: Chat[] = [];

export const addActiveUser = (userId: string, socketId: string) => {
  activeUsers.push({ id: userId, socketId });
};

export const removeActiveUser = (socketId: string) => {
  const index = activeUsers.findIndex(u => u.socketId === socketId);
  if (index !== -1) {
    return activeUsers.splice(index, 1)[0];
  }
};

export const findActiveUserBySocketId = (socketId: string) => {
  console.log({ activeUsers });
  return activeUsers.find(u => u.socketId === socketId);
};

export const addToWaitingList = (userId: string, socketId: string) => {
  waitingUsers.push({userId, socketId});
};

export const removeFromWaitingList = (userId: string) => {
  const index = waitingUsers.findIndex(user => user.userId === userId);
  if (index !== -1) {
    waitingUsers.splice(index, 1);
  }
};

export const startChat = (userId: string, socketId: string) => {
  if (waitingUsers.length > 0) {
    const partnerData = waitingUsers.shift()!;
    const chatId = uuidv4();
    
    const chat: Chat = { id: chatId, participants: [
      { userId, socketId},
      {userId: partnerData.userId, socketId: partnerData.socketId}]
    };
    activeChats.push(chat);
    const user = activeUsers.find(u => u.id === userId);
    const partner = activeUsers.find(u => u.id === partnerData.userId);

    if (user && partner) {
      user.chatId = chatId;
      partner.chatId = chatId;
      return { chatId, user, partner };
    }
  }
  return null;
};

export const findChatById = (chatId: string) => {
  return activeChats.find(c => c.id === chatId);
};

export const removeChat = (chatId: string) => {
  const index = activeChats.findIndex(c => c.id === chatId);
  if (index !== -1) {
    activeChats.splice(index, 1);
  }
};
