import { Server, Socket } from 'socket.io';
import {
  addActiveUser,
  removeActiveUser,
  findActiveUserByUserId,
  addToWaitingList,
  removeFromWaitingList,
  startChat,
  findChatById,
  removeChat
} from '../services/chatService';

const startChating = (io: Server, socket: Socket, userId: string) => {  
  const chatStarted = startChat(userId, socket.id);
  console.log('chatStarted', chatStarted);
  
  if (chatStarted) {
    const { id: chatId, participants } = chatStarted;
    const [user, partner] = participants;
    io.to(user.socketId).emit('chat_started', chatId, partner.username);
    io.to(partner.socketId).emit('chat_started', chatId, user.username);
  } else {
    addToWaitingList(userId, socket.id);
    socket.emit('waiting');
  }
}

export const setupSocketIO = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('A user connected', socket.data.userId);

    socket.on('join', (userId: string, username: string) => {
      console.log('User connected: ', userId);
      addActiveUser(userId, socket.id, username);
    });

    socket.on('start_chat', (userId: string) => {
      startChating(io, socket, userId);
      // const chatStarted = startChat(userId, socket.id);
      // if (chatStarted) {
      //   const { chatId, user, partner } = chatStarted;
      //   io.to(user.socketId).emit('chat_started', chatId);
      //   io.to(partner.socketId).emit('chat_started', chatId);
      // } else {
      //   addToWaitingList(userId, socket.id);
      //   socket.emit('waiting');
      // }
    });

    socket.on('send_message', (message: string, chatId: string, userId: string) => {
      const chat = findChatById(chatId);
      if (chat) {
        chat.participants.forEach(participant => {
          userId !== participant.userId && io.to(participant.socketId).emit('message', message);
        });
      } else {
        throw new Error('Chat not found');
      }
    });

    socket.on('end_chat', (chatId?: string, userId?: string) => {
      if (!chatId) {
        userId && removeFromWaitingList(userId);
        io.to(socket.id).emit('chat_ended');
        return;
      }
      const chat = findChatById(chatId);
      if (chat) {
        chat.participants.forEach(participant => {
          console.log('Chat ended');
          
          io.to(participant.socketId).emit('chat_ended');
        });
        removeChat(chatId);
      }
    });

    socket.on('disconnect', () => {
      const user = removeActiveUser(socket.data.userId);
      if (user) {
        if (user.chatId) {
          const chat = findChatById(user.chatId);
          if (chat) {
            const partnerId = chat.participants.find(participant => participant.userId !== user.id);
            if (partnerId) {
              const partner = findActiveUserByUserId(partnerId.userId);
              if (partner) {
                io.to(partner.socketId).emit('partner_disconnected');
                partner.chatId = undefined;
              }
            }
            removeChat(user.chatId);
          }
        }
        removeFromWaitingList(user.id);
      }
    });
  });
};
