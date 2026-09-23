import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();
const SOCKET_URL = 'https://project-tracker-backend-85u8.onrender.com';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.token) {
      const newSocket = io(SOCKET_URL, {
        transports: ['polling', 'websocket'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        timeout: 20000
      });

      newSocket.on('connect', () => {
        console.log('✅ Socket connecté:', newSocket.id);
        const userId = user._id || user.id;
        if (userId) {
          newSocket.emit('joinRoom', userId);
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.log('⚠️ Socket déconnecté:', reason);
      });

      newSocket.on('connect_error', (error) => {
        console.log('Connexion en cours au serveur Render...');
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);