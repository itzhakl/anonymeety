import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth';
import { setupSocketIO } from './socket/chatSocket';
import cors from 'cors'

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
app.use(cors({
  origin: 'http://localhost:3000'
}))
app.use(express.json());
app.use('/auth', authRoutes);

setupSocketIO(io);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});