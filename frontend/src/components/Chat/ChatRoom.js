import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const ChatRoom = ({ conversationId }) => {
  const { API, user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetchMessages();
    if (socket) {
      socket.emit('chat:join', conversationId);
      socket.on('chat:message', (msg) => {
        setMessages(prev => [...prev, msg]);
      });
      return () => {
        socket.emit('chat:leave', conversationId);
        socket.off('chat:message');
      };
    }
  }, [conversationId, socket]);

  const fetchMessages = async () => {
    try {
      const { data } = await API.get(`/messages/${conversationId}`);
      setMessages(data.messages || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim() && socket) {
      socket.emit('chat:message', { conversationId, content: text });
      setText('');
    }
  };

  return (
    <div className="chat-room">
      <div className="chat-messages">
        {messages.map((msg, i) => {
          const isOwn = msg.sender?._id === user?._id;
          return (
            <div key={i} className={`message ${isOwn ? 'own' : ''}`}>
              <div className="message-bubble">
                <span style={{ fontSize: 10, display: 'block', fontWeight: 600, color: isOwn ? '#E0E7FF' : '#4F46E5' }}>
                  {msg.sender?.name}
                </span>
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="message-form">
        <input
          type="text"
          className="message-input"
          placeholder="Ktb message..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">📤</button>
      </form>
    </div>
  );
};

export default ChatRoom;