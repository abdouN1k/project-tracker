import { useState, useEffect, useCallback, useRef } from 'react';
import { FaPaperPlane, FaComments, FaFileAlt, FaClipboardCheck, FaTimes, FaPhone, FaEnvelope, FaUser, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const ChatPage = () => {
  const { user, API } = useAuth();
  const { socket } = useSocket();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [activeForm, setActiveForm] = useState(null);
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [rapportForm, setRapportForm] = useState({ date: new Date().toISOString().split('T')[0], articles: [{ designation: '', quantite: '' }], materiels: '', personnels: '' });
  const [attachementForm, setAttachementForm] = useState({ date: new Date().toISOString().split('T')[0], articles: [{ designation: '', qteContrat: 0, qtePrecedente: 0, qteMois: 0 }] });

  const fetchUsers = useCallback(async () => {
    try { const { data } = await API.get('/users'); setUsers(data || []); } catch (err) {}
  }, [API]);

  const fetchMessages = useCallback(async (userId) => {
    try { const { data } = await API.get(`/chat/${userId}`); setMessages(data || []); } catch (err) {}
  }, [API]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { if (selectedUser) fetchMessages(selectedUser._id); }, [selectedUser, fetchMessages]);

  useEffect(() => {
    if (!socket) return;
    socket.on('newMessage', (msg) => {
      if (selectedUser && (msg.sender._id === selectedUser._id || msg.receiver._id === selectedUser._id)) {
        setMessages((prev) => [...prev, msg]);
      }
      setTyping(false);
      setTypingUser('');
    });
    socket.on('userTyping', (data) => {
      if (data.senderId === selectedUser?._id) {
        setTypingUser(data.name || 'L\'utilisateur');
        setTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => { setTyping(false); setTypingUser(''); }, 3000);
      }
    });
    return () => { socket.off('newMessage'); socket.off('userTyping'); };
  }, [socket, selectedUser]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleTyping = (e) => {
    setText(e.target.value);
    if (socket && selectedUser) socket.emit('userTyping', { senderId: user._id, receiverId: selectedUser._id, name: user.name });
  };

  const handleSendText = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedUser) return;
    try {
      const { data } = await API.post('/chat', { content: text, receiver: selectedUser._id, type: 'text' });
      setMessages((prev) => [...prev, data]);
      if (socket) socket.emit('sendMessage', { receiverId: selectedUser._id, message: data });
      setText('');
    } catch (err) {}
  };

  // ... (نفس الكود ديال الارسال القديم)
  const handleSendRapport = async (e) => { /*...*/ };
  const handleSendAttachement = async (e) => { /*...*/ };

  return (
    <div className="chat-container">

      {/* Sidebar - تختفي فالموبايل ملي نعزلو مستخدم */}
      <div className={`chat-sidebar ${selectedUser ? 'hidden-mobile' : ''}`}>
        <div className="chat-sidebar-header">
          <FaComments /> Contacts CoSider
        </div>
        {users.map((u) => (
          <div key={u._id} className={`chat-user-item ${selectedUser?._id === u._id ? 'active' : ''}`} onClick={() => setSelectedUser(u)}>
            <div className="avatar">{u.name?.charAt(0)}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>{u.name}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>{u.poste || u.role}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chat - تبان فالموبايل غير ملي نعزلو مستخدم */}
      <div className={`chat-main ${!selectedUser ? 'hidden-mobile' : ''}`}>
        {selectedUser ? (
          <>
            <div className="chat-header">
              <button className="mobile-back-btn" onClick={() => setSelectedUser(null)}>
                <FaArrowLeft />
              </button>
              <div className="avatar">{selectedUser.name?.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{selectedUser.name}</div>
                <div style={{ fontSize: 12, color: '#10b981' }}>{typing ? 'Écrit...' : 'En ligne'}</div>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg._id} className={`message ${msg.sender._id === user._id ? 'sent' : 'received'}`}>
                  {msg.type === 'text' && <div>{msg.content}</div>}
                  {/* هنا يتروندا الرسائل بحال قبل */}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSendText}>
              <input type="text" className="input" placeholder="Message..." value={text} onChange={handleTyping} />
              <button type="submit" className="btn btn-primary"><FaPaperPlane /></button>
            </form>
          </>
        ) : (
          <div className="chat-empty hidden-mobile">
            <FaComments size={64} color="#d1fae5" />
            <p>Sélectionnez un contact</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;