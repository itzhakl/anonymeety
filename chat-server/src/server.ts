import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import { PORT } from './config';
import { authenticateSocket } from './middleware/auth';
import { setupSocketIO } from './socket/chatSocket'
import { setupSocketHandlers } from './services/socketService';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.use(authenticateSocket);

setupSocketIO(io);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});