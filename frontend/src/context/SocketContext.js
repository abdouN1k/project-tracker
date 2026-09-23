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
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        if (user._id) {
          newSocket.emit('joinRoom', user._id);
        }
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