import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const ChatRoom = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const { user, API } = useAuth();
  const { socket } = useSocket();

  const fetchMessages = useCallback(async () => {
    try {
      const { data } = await API.get(`/chat/${roomId}`);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  }, [API, roomId]);

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('joinRoom', roomId);

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off('message');
    };
  }, [socket, roomId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const { data } = await API.post('/chat', {
        content: text,
        room: roomId
      });
      if (socket) {
        socket.emit('sendMessage', { roomId, message: data });
      }
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>غرفة المحادثة</h3>
      <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <div key={msg._id || index} style={{ marginBottom: '8px' }}>
            <strong>{msg.sender?.name || 'مستخدم'}: </strong>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب رسالتك..."
          style={{ width: '80%', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', marginLeft: '10px' }}>إرسال</button>
      </form>
    </div>
  );
};

export default ChatRoom;