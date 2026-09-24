import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import io from 'socket.io-client';
import axios from 'axios';
import { Send, FileText, Paperclip, Phone, Mail, UserCheck, ArrowLeft, Info } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://project-tracker-backend-85u8.onrender.com';

const Chat = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [showRapportModal, setShowRapportModal] = useState(false);
  const [showAttachementModal, setShowAttachementModal] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');

  // Rapport Form State
  const [rapportData, setRapportData] = useState({
    ntProjet: '',
    avancement: '',
    travauxEffectues: '',
    remarques: ''
  });

  // Attachement Form State
  const [attachementData, setAttachementData] = useState({
    ntProjet: '',
    designation: '',
    quantite: '',
    observations: ''
  });

  const messagesEndRef = useRef(null);

  // Socket setup
  useEffect(() => {
    const newSocket = io(BACKEND_URL, { reconnectionAttempts: 10 });
    setSocket(newSocket);

    if (user && user._id) {
      newSocket.emit('joinRoom', { userId: user._id });
    }

    return () => newSocket.close();
  }, [user]);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BACKEND_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data.filter(u => u._id !== user._id));
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, [user]);

  // Socket listener for messages & typing
  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (message) => {
      if (selectedUser && (message.sender === selectedUser._id || message.receiver === selectedUser._id)) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on('userTyping', (data) => {
      if (selectedUser && data.senderId === selectedUser._id) {
        setIsTyping(data.isTyping);
        setTypingUser(data.senderName);
      }
    });

    return () => {
      socket.off('newMessage');
      socket.off('userTyping');
    };
  }, [socket, selectedUser]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch Chat History
  const selectContact = async (u) => {
    setSelectedUser(u);
    setShowContactInfo(false);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/chat/${u._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (socket && selectedUser) {
      socket.emit('typing', {
        receiverId: selectedUser._id,
        senderId: user._id,
        senderName: user.name,
        isTyping: e.target.value.length > 0
      });
    }
  };

  const sendMessage = async (type = 'text', customData = null) => {
    if (!selectedUser) return;
    if (type === 'text' && !newMessage.trim()) return;

    const payload = {
      receiverId: selectedUser._id,
      content: type === 'text' ? newMessage : '',
      type,
      reportData: customData
    };

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${BACKEND_URL}/api/chat`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages((prev) => [...prev, res.data]);
      if (socket) {
        socket.emit('sendMessage', res.data);
      }
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleSendRapport = (e) => {
    e.preventDefault();
    sendMessage('rapport_journalier', rapportData);
    setShowRapportModal(false);
    setRapportData({ ntProjet: '', avancement: '', travauxEffectues: '', remarques: '' });
  };

  const handleSendAttachement = (e) => {
    e.preventDefault();
    sendMessage('attachement', attachementData);
    setShowAttachementModal(false);
    setAttachementData({ ntProjet: '', designation: '', quantite: '', observations: '' });
  };

  // Directeur CANNOT send reports, everyone else CAN!
  const isDirecteur = user?.role === 'Directeur';

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 h-[calc(100vh-80px)]">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex h-full overflow-hidden">

        {/* Contact List */}
        <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-1/3 border-r border-gray-200 bg-gray-50`}>
          <div className="p-4 bg-white border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Contacts CoSider</h2>
            <p className="text-xs text-gray-500">Sélectionnez un contact pour discuter</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {users.map((u) => (
              <div
                key={u._id}
                onClick={() => selectContact(u)}
                className={`p-4 cursor-pointer transition-colors hover:bg-red-50 flex items-center justify-between ${
                  selectedUser?._id === u._id ? 'bg-red-50 border-l-4 border-red-600' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{u.name}</h3>
                    <p className="text-xs text-gray-500">{u.role || 'Responsable'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${!selectedUser ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-2/3 bg-white`}>
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm">
                <div className="flex items-center space-x-3">
                  <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{selectedUser.name}</h3>
                    <p className="text-xs text-green-600 font-semibold">{isTyping ? 'en train d\'écrire...' : 'En ligne'}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowContactInfo(!showContactInfo)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>

              {/* Info Drawer */}
              {showContactInfo && (
                <div className="bg-red-50 border-b border-red-100 p-4 text-sm text-gray-700 space-y-2">
                  <div className="flex items-center space-x-2"><UserCheck className="w-4 h-4 text-red-600" /> <span>Rôle: <strong>{selectedUser.role || 'Responsable Projet'}</strong></span></div>
                  <div className="flex items-center space-x-2"><Phone className="w-4 h-4 text-red-600" /> <span>Tél: <strong>{selectedUser.phone || 'N/A'}</strong></span></div>
                  <div className="flex items-center space-x-2"><Mail className="w-4 h-4 text-red-600" /> <span>Email: <strong>{selectedUser.email}</strong></span></div>
                </div>
              )}

              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                {messages.map((m, idx) => {
                  const isMe = m.sender === user._id;
                  return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 shadow-sm ${
                        isMe ? 'bg-red-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                      }`}>
                        {m.type === 'text' && <p className="text-sm font-medium">{m.content}</p>}

                        {m.type === 'rapport_journalier' && (
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-yellow-400 text-gray-900">
                              📋 Rapport Journalier
                            </span>
                            <div className="text-xs font-semibold mt-1">NT Projet: {m.reportData?.ntProjet}</div>
                            <div className="text-xs">Avancement: <strong>{m.reportData?.avancement}%</strong></div>
                            <div className="text-xs mt-1 bg-black/10 p-2 rounded">Travaux: {m.reportData?.travauxEffectues}</div>
                          </div>
                        )}

                        {m.type === 'attachement' && (
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-green-400 text-gray-900">
                              📎 PV d'Attachement
                            </span>
                            <div className="text-xs font-semibold mt-1">NT Projet: {m.reportData?.ntProjet}</div>
                            <div className="text-xs">Désignation: {m.reportData?.designation}</div>
                            <div className="text-xs">Quantité: <strong>{m.reportData?.quantite}</strong></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input & Action Buttons */}
              <div className="p-3 bg-white border-t border-gray-200 space-y-2">
                {/* Send Rapport / Attachement buttons (Hidden for Directeur) */}
                {!isDirecteur && (
                  <div className="flex items-center space-x-2 pb-1">
                    <button
                      onClick={() => setShowRapportModal(true)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-xs font-bold transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Rapport Journalier</span>
                    </button>

                    <button
                      onClick={() => setShowAttachementModal(true)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>PV d'Attachement</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Écrivez votre message..."
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                  />
                  <button
                    onClick={() => sendMessage()}
                    className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-md"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-400">
              <p>Sélectionnez un contact pour commencer la conversation</p>
            </div>
          )}
        </div>

      </div>

      {/* Rapport Journalier Modal */}
      {showRapportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Créer Rapport Journalier</h3>
            <form onSubmit={handleSendRapport} className="space-y-3">
              <input
                type="text" placeholder="NT de Projet" required
                value={rapportData.ntProjet} onChange={(e) => setRapportData({...rapportData, ntProjet: e.target.value})}
                className="w-full border rounded-lg p-2 text-sm"
              />
              <input
                type="number" placeholder="Avancement (%)" required
                value={rapportData.avancement} onChange={(e) => setRapportData({...rapportData, avancement: e.target.value})}
                className="w-full border rounded-lg p-2 text-sm"
              />
              <textarea
                placeholder="Travaux Effectués" required rows="3"
                value={rapportData.travauxEffectues} onChange={(e) => setRapportData({...rapportData, travauxEffectues: e.target.value})}
                className="w-full border rounded-lg p-2 text-sm"
              ></textarea>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowRapportModal(false)} className="px-4 py-2 text-sm text-gray-600">Annuler</button>
                <button type="submit" className="px-4 py-2 text-sm bg-red-600 text-white font-bold rounded-lg">Envoyer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attachement Modal */}
      {showAttachementModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Créer PV d'Attachement</h3>
            <form onSubmit={handleSendAttachement} className="space-y-3">
              <input
                type="text" placeholder="NT de Projet" required
                value={attachementData.ntProjet} onChange={(e) => setAttachementData({...attachementData, ntProjet: e.target.value})}
                className="w-full border rounded-lg p-2 text-sm"
              />
              <input
                type="text" placeholder="Désignation" required
                value={attachementData.designation} onChange={(e) => setAttachementData({...attachementData, designation: e.target.value})}
                className="w-full border rounded-lg p-2 text-sm"
              />
              <input
                type="number" placeholder="Quantité" required
                value={attachementData.quantite} onChange={(e) => setAttachementData({...attachementData, quantite: e.target.value})}
                className="w-full border rounded-lg p-2 text-sm"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowAttachementModal(false)} className="px-4 py-2 text-sm text-gray-600">Annuler</button>
                <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white font-bold rounded-lg">Envoyer</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Chat;