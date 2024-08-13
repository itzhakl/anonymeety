import { KeyObject } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { User } from './../models/user';

export interface ActiveUser {
  id: string;
  username: string;
  socketId: string;
  chatId?: string;
}

export interface WaitingUser {
  userId: string;
  username: string;
  socketId: string;
}

export interface Chat {
  id: string;
  participants: WaitingUser[];
}

const activeUsers: ActiveUser[] = [];
const waitingUsers: WaitingUser[] = [];
const activeChats: Chat[] = [];

export const addActiveUser = (userId: string, socketId: string, username: string) => {
  //TODO: check if user is already in waiting list, check the code if it's working
  const existingUser = findActiveUserByUserId(userId)
  existingUser ? 
    existingUser.socketId = socketId : 
      activeUsers.push({ id: userId, socketId, username });
};

export const removeActiveUser = (userId: string) => {
  const index = activeUsers.findIndex(u => u.id === userId);
  if (index !== -1) {
    return activeUsers.splice(index, 1)[0];
  }
};

export const findActiveUserByUserId = (userId: string) => {
  return activeUsers.find(u => u.id === userId);
};

export const addToWaitingList = (userId: string, socketId: string) => {
  //TODO: check if user is already in waiting list, check the code if it's working
  const existingUser = waitingUsers.find(u => u.userId === userId);
  if (existingUser) {
    existingUser.socketId = socketId;
    return;
  } else {
    const username = findActiveUserByUserId(userId)?.username;
    username && waitingUsers.push({userId, socketId, username});
  }
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
    const username = findActiveUserByUserId(userId)?.username;
    if (!username) {
      return null;
    }
    const chat: Chat = { id: chatId, participants: [
      { userId, socketId, username},
      {userId: partnerData.userId, socketId: partnerData.socketId, username: partnerData.username}]
    };
    
    activeChats.push(chat);
    const user = activeUsers.find(u => u.id === userId);
    const partner = activeUsers.find(u => u.id === partnerData.userId);
    
    if (user && partner) {
      user.chatId = chatId;
      partner.chatId = chatId;
      return chat;
    }
    //todo
  }
  return null;
};

export const endChat = (chatId: string) => {
  const index = activeChats.findIndex(c => c.id === chatId);
  if (index !== -1) {
    activeChats.splice(index, 1);
  }
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
