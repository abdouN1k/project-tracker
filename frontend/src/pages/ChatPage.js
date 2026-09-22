import { useState, useEffect, useCallback, useRef } from 'react';
import { FaPaperPlane, FaComments } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const ChatPage = () => {
  const { user, API } = useAuth();
  const { socket } = useSocket();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data);
    } catch (err) { console.error(err); }
  }, [API]);

  const fetchMessages = useCallback(async (userId) => {
    try {
      const { data } = await API.get(`/chat/${userId}`);
      setMessages(data);
    } catch (err) { console.error(err); }
  }, [API]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return;
    socket.on('newMessage', (msg) => {
      if (selectedUser && (msg.sender._id === selectedUser._id || msg.receiver._id === selectedUser._id)) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off('newMessage');
  }, [socket, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedUser) return;
    try {
      const { data } = await API.post('/chat', { content: text, receiver: selectedUser._id });
      setMessages((prev) => [...prev, data]);
      if (socket) socket.emit('sendMessage', { receiverId: selectedUser._id, message: data });
      setText('');
    } catch (err) { console.error(err); }
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <FaComments /> Conversations
        </div>
        {users.map((u) => (
          <div key={u._id} className={`chat-user-item ${selectedUser?._id === u._id ? 'active' : ''}`} onClick={() => setSelectedUser(u)}>
            <div className="avatar">{getInitials(u.name)}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{u.name}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{u.email}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-main">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <div className="avatar">{getInitials(selectedUser.name)}</div>
              <div>
                <div style={{ fontWeight: 600 }}>{selectedUser.name}</div>
                <div style={{ fontSize: 12, color: '#10b981' }}>● En ligne</div>
              </div>
            </div>
            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg._id} className={`message ${msg.sender._id === user._id ? 'sent' : 'received'}`}>
                  <div>{msg.content}</div>
                  <div className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form className="chat-input-area" onSubmit={handleSend}>
              <input type="text" className="input" placeholder="Écrivez un message..." value={text} onChange={(e) => setText(e.target.value)} />
              <button type="submit" className="btn btn-primary">
                <FaPaperPlane />
              </button>
            </form>
          </>
        ) : (
          <div className="chat-empty">
            <FaComments size={64} color="#d1fae5" />
            <p>Sélectionnez une conversation pour commencer</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;