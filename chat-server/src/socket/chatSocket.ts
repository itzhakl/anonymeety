import { Server, Socket } from 'socket.io';
import {
  addActiveUser,
  removeActiveUser,
  findActiveUserBySocketId,
  addToWaitingList,
  removeFromWaitingList,
  startChat,
  findChatById,
  removeChat
} from '../services/chatService';

const startChating = (io: Server, socket: Socket, userId: string) => {
  const chatStarted = startChat(userId, socket.id);
  if (chatStarted) {
    const { chatId, user, partner } = chatStarted;
    io.to(user.socketId).emit('chat_started', chatId);
    io.to(partner.socketId).emit('chat_started', chatId);
  } else {
    addToWaitingList(userId, socket.id);
    socket.emit('waiting');
  }
}

export const setupSocketIO = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('A user connected');

    socket.on('user_connected', (userId: string) => {
      addActiveUser(userId, socket.id);
    });

    socket.on('start_chat', (userId: string) => {
      console.log('Chat started with user:', userId);
      
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
      }
    });

    socket.on('end_chat', (chatId: string) => {
      const chat = findChatById(chatId);
      if (chat) {
        chat.participants.forEach(participant => {
          io.to(participant.socketId).emit('chat_ended');
        });
        removeChat(chatId);
        chat.participants.forEach(participant => {
          startChating(io, socket, participant.userId);
        })
      }
    });

    socket.on('disconnect', () => {
      const user = removeActiveUser(socket.id);
      if (user) {
        if (user.chatId) {
          const chat = findChatById(user.chatId);
          if (chat) {
            const partnerId = chat.participants.find(participant => participant.userId !== user.id);
            if (partnerId) {
              const partner = findActiveUserBySocketId(partnerId.userId);
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
