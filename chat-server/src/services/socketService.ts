import { Server, Socket } from 'socket.io';

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.data.userId);

    socket.on('start_chat', (userId: string) => {
      // לוגיקה להתחלת צ'אט
    });

    socket.on('send_message', (message: string, chatId: string) => {
      // לוגיקה לשליחת הודעה
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.userId);
      // לוגיקה לניתוק משתמש
    });
  });
};
