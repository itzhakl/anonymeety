import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import { User } from '../types';
import { SOCKET_URL } from '../utils/constants';

export const useSocket = (user: User | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const navigate = useNavigate();

  const connectSocket = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return null;
    }
    const newSocket = io(SOCKET_URL, {
      auth: { token }
    });
    
    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
      navigate('/');
    });

    setSocket(newSocket);
    return newSocket;
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const socket = connectSocket();
    if (socket) {
      socket.emit('join', user.id, user.username);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user, connectSocket]);

  return socket;
};
