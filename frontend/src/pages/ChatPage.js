import { useState, useEffect, useCallback, useRef } from 'react';
import { FaPaperPlane, FaComments, FaFileAlt, FaClipboardCheck, FaTimes, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';
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

  // Rapport Journalier Form
  const [rapportForm, setRapportForm] = useState({
    date: new Date().toISOString().split('T')[0],
    articles: [{ designation: '', quantite: '' }],
    materiels: '',
    personnels: ''
  });

  // Attachement Form
  const [attachementForm, setAttachementForm] = useState({
    date: new Date().toISOString().split('T')[0],
    articles: [{ designation: '', qteContrat: 0, qtePrecedente: 0, qteMois: 0 }]
  });

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data || []);
    } catch (err) { console.error(err); }
  }, [API]);

  const fetchMessages = useCallback(async (userId) => {
    try {
      const { data } = await API.get(`/chat/${userId}`);
      setMessages(data || []);
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
      setTyping(false);
      setTypingUser('');
    });

    socket.on('userTyping', (data) => {
      if (data.senderId === selectedUser?._id) {
        setTypingUser(data.name || 'L\'utilisateur');
        setTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setTyping(false);
          setTypingUser('');
        }, 3000);
      }
    });

    return () => {
      socket.off('newMessage');
      socket.off('userTyping');
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Typing event
  const handleTyping = (e) => {
    setText(e.target.value);
    if (socket && selectedUser) {
      socket.emit('userTyping', {
        senderId: user._id,
        receiverId: selectedUser._id,
        name: user.name
      });
    }
  };

  // Send simple text
  const handleSendText = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedUser) return;
    try {
      const { data } = await API.post('/chat', { content: text, receiver: selectedUser._id, type: 'text' });
      setMessages((prev) => [...prev, data]);
      if (socket) socket.emit('sendMessage', { receiverId: selectedUser._id, message: data });
      setText('');
    } catch (err) { console.error(err); }
  };

  // Send Rapport Journalier
  const handleSendRapport = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/chat', {
        receiver: selectedUser._id,
        type: 'rapport_journalier',
        reportData: rapportForm
      });
      setMessages((prev) => [...prev, data]);
      if (socket) socket.emit('sendMessage', { receiverId: selectedUser._id, message: data });
      setActiveForm(null);
      setRapportForm({ date: new Date().toISOString().split('T')[0], articles: [{ designation: '', quantite: '' }], materiels: '', personnels: '' });
      toast.success('Rapport journalier envoyé !');
    } catch (err) { toast.error('Erreur d\'envoi'); }
  };

  // Send Attachement
  const handleSendAttachement = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/chat', {
        receiver: selectedUser._id,
        type: 'attachement',
        reportData: attachementForm
      });
      setMessages((prev) => [...prev, data]);
      if (socket) socket.emit('sendMessage', { receiverId: selectedUser._id, message: data });
      setActiveForm(null);
      setAttachementForm({ date: new Date().toISOString().split('T')[0], articles: [{ designation: '', qteContrat: 0, qtePrecedente: 0, qteMois: 0 }] });
      toast.success('Attachement envoyé !');
    } catch (err) { toast.error('Erreur d\'envoi'); }
  };

  return (
    <div className="chat-container">
      {/* Sidebar Contacts */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <FaComments /> Contacts CoSider
        </div>
        {users.map((u) => (
          <div
            key={u._id}
            className={`chat-user-item ${selectedUser?._id === u._id ? 'active' : ''}`}
            onClick={() => setSelectedUser(u)}
          >
            <div className="avatar">{u.name?.charAt(0)}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{u.name}</div>
              {selectedUser?._id === u._id && (
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
                  <div><FaPhone /> {u.phone || 'N/A'}</div>
                  <div><FaEnvelope /> {u.email}</div>
                  <div><FaUser /> {u.role || 'Responsable Projet'}</div>
                </div>
              )}
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
            Aucun autre utilisateur inscrit pour l'instant.
          </div>
        )}
      </div>

      {/* Main Chat */}
      <div className="chat-main">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="avatar">{selectedUser.name?.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{selectedUser.name}</div>
                <div style={{ fontSize: 12, color: '#10b981' }}>
                  {typing ? `${typingUser} est en train d'écrire...` : '● En ligne'}
                </div>
              </div>

              {/* Boutons Rapport & Attachement - Uniquement pour Responsable Projet */}
              {user?.role !== 'Directeur' && (
                <>
                  <button
                    className="btn btn-outline"
                    style={{ fontSize: 12, padding: '6px 12px' }}
                    onClick={() => setActiveForm(activeForm === 'rapport' ? null : 'rapport')}
                  >
                    <FaFileAlt /> Rapport Journalier
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: 12, padding: '6px 12px' }}
                    onClick={() => setActiveForm(activeForm === 'attachement' ? null : 'attachement')}
                  >
                    <FaClipboardCheck /> Attachement
                  </button>
                </>
              )}
            </div>

            {/* Form Rapport Journalier */}
            {activeForm === 'rapport' && (
              <div className="card fade-in" style={{ margin: 15, background: '#f0fdf4', border: '2px solid #16a34a', maxHeight: 350, overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <h4 style={{ color: '#16a34a' }}>📑 Nouveau Rapport Journalier</h4>
                  <button className="btn btn-danger" style={{ padding: 4 }} onClick={() => setActiveForm(null)}><FaTimes /></button>
                </div>
                <form onSubmit={handleSendRapport}>
                  <div className="form-group">
                    <label className="form-label">Date du Rapport</label>
                    <input type="date" className="input" value={rapportForm.date} onChange={(e) => setRapportForm({ ...rapportForm, date: e.target.value })} required />
                  </div>
                  <label className="form-label">Travaux Exécutés (Articles & Quantités)</label>
                  {rapportForm.articles.map((art, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <input type="text" className="input" placeholder="Désignation article" value={art.designation} onChange={(e) => {
                        const newArt = [...rapportForm.articles]; newArt[idx].designation = e.target.value; setRapportForm({ ...rapportForm, articles: newArt });
                      }} required />
                      <input type="number" className="input" placeholder="Quantité" value={art.quantite} onChange={(e) => {
                        const newArt = [...rapportForm.articles]; newArt[idx].quantite = e.target.value; setRapportForm({ ...rapportForm, articles: newArt });
                      }} required />
                      {rapportForm.articles.length > 1 && (
                        <button type="button" className="btn btn-danger" style={{ padding: '4px 8px' }} onClick={() => {
                          setRapportForm({ ...rapportForm, articles: rapportForm.articles.filter((_, i) => i !== idx) });
                        }}><FaTimes /></button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline" style={{ padding: '4px 8px', fontSize: 12, marginBottom: 10 }} onClick={() => setRapportForm({ ...rapportForm, articles: [...rapportForm.articles, { designation: '', quantite: '' }] })}>+ Article</button>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">Matériels Utilisés</label>
                      <input type="text" className="input" placeholder="Ex: 2 Pelles, 1 Camion" value={rapportForm.materiels} onChange={(e) => setRapportForm({ ...rapportForm, materiels: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Personnels Présents</label>
                      <input type="text" className="input" placeholder="Ex: 5 Ouvriers, 1 Chef" value={rapportForm.personnels} onChange={(e) => setRapportForm({ ...rapportForm, personnels: e.target.value })} required />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Envoyer le Rapport</button>
                </form>
              </div>
            )}

            {/* Form Attachement */}
            {activeForm === 'attachement' && (
              <div className="card fade-in" style={{ margin: 15, background: '#f0fdf4', border: '2px solid #ca8a04', maxHeight: 350, overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <h4 style={{ color: '#ca8a04' }}>📊 Procès-Verbal d'Attachement</h4>
                  <button className="btn btn-danger" style={{ padding: 4 }} onClick={() => setActiveForm(null)}><FaTimes /></button>
                </div>
                <form onSubmit={handleSendAttachement}>
                  <div className="form-group">
                    <label className="form-label">Date d'Attachement</label>
                    <input type="date" className="input" value={attachementForm.date} onChange={(e) => setAttachementForm({ ...attachementForm, date: e.target.value })} required />
                  </div>
                  {attachementForm.articles.map((art, idx) => (
                    <div key={idx} style={{ background: '#fff', padding: 10, borderRadius: 8, marginBottom: 10, border: '1px solid #d1fae5' }}>
                      <input type="text" className="input" placeholder="Désignation" style={{ marginBottom: 6 }} value={art.designation} onChange={(e) => {
                        const newArt = [...attachementForm.articles]; newArt[idx].designation = e.target.value; setAttachementForm({ ...attachementForm, articles: newArt });
                      }} required />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                        <div><small>Qte Contrat</small><input type="number" className="input" value={art.qteContrat} onChange={(e) => {
                          const newArt = [...attachementForm.articles]; newArt[idx].qteContrat = Number(e.target.value); setAttachementForm({ ...attachementForm, articles: newArt });
                        }} /></div>
                        <div><small>Qte Précédente</small><input type="number" className="input" value={art.qtePrecedente} onChange={(e) => {
                          const newArt = [...attachementForm.articles]; newArt[idx].qtePrecedente = Number(e.target.value); setAttachementForm({ ...attachementForm, articles: newArt });
                        }} /></div>
                        <div><small>Qte du Mois</small><input type="number" className="input" value={art.qteMois} onChange={(e) => {
                          const newArt = [...attachementForm.articles]; newArt[idx].qteMois = Number(e.target.value); setAttachementForm({ ...attachementForm, articles: newArt });
                        }} /></div>
                      </div>
                      <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: '#16a34a' }}>
                        Cumul : {Number(art.qtePrecedente || 0) + Number(art.qteMois || 0)}
                      </div>
                      {attachementForm.articles.length > 1 && (
                        <button type="button" className="btn btn-danger" style={{ padding: '2px 6px', marginTop: 4, fontSize: 11 }} onClick={() => {
                          setAttachementForm({ ...attachementForm, articles: attachementForm.articles.filter((_, i) => i !== idx) });
                        }}>Supprimer cette ligne</button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline" style={{ padding: '4px 8px', fontSize: 12, marginBottom: 10 }} onClick={() => setAttachementForm({ ...attachementForm, articles: [...attachementForm.articles, { designation: '', qteContrat: 0, qtePrecedente: 0, qteMois: 0 }] })}>+ Ligne</button>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#ca8a04' }}>Envoyer l'Attachement</button>
                </form>
              </div>
            )}

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg._id} className={`message ${msg.sender._id === user._id ? 'sent' : 'received'}`} style={{ maxWidth: msg.type !== 'text' ? '85%' : '60%' }}>

                  {msg.type === 'text' && <div>{msg.content}</div>}

                  {msg.type === 'rapport_journalier' && (
                    <div style={{ background: '#fff', color: '#111', padding: 12, borderRadius: 10, borderLeft: '5px solid #16a34a' }}>
                      <h4 style={{ color: '#16a34a', margin: '0 0 6px 0' }}>📑 Rapport Journalier - {msg.reportData?.date}</h4>
                      <strong>Travaux Exécutés :</strong>
                      <ul>
                        {msg.reportData?.articles?.map((art, i) => (
                          <li key={i}>{art.designation} : <strong>{art.quantite}</strong></li>
                        ))}
                      </ul>
                      <div>🚜 <strong>Matériels:</strong> {msg.reportData?.materiels}</div>
                      <div>👷 <strong>Personnels:</strong> {msg.reportData?.personnels}</div>
                    </div>
                  )}

                  {msg.type === 'attachement' && (
                    <div style={{ background: '#fff', color: '#111', padding: 12, borderRadius: 10, borderLeft: '5px solid #ca8a04', overflowX: 'auto' }}>
                      <h4 style={{ color: '#ca8a04', margin: '0 0 8px 0' }}>📊 Attachement - {msg.reportData?.date}</h4>
                      <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', textAlign: 'left' }} border="1" cellPadding="6">
                        <thead>
                          <tr style={{ background: '#f3f4f6' }}>
                            <th>Désignation</th>
                            <th>Qte Contrat</th>
                            <th>Qte Préc.</th>
                            <th>Qte Mois</th>
                            <th>Cumul</th>
                          </tr>
                        </thead>
                        <tbody>
                          {msg.reportData?.articles?.map((art, i) => (
                            <tr key={i}>
                              <td>{art.designation}</td>
                              <td>{art.qteContrat}</td>
                              <td>{art.qtePrecedente}</td>
                              <td>{art.qteMois}</td>
                              <td style={{ fontWeight: 700, color: '#16a34a' }}>{Number(art.qtePrecedente || 0) + Number(art.qteMois || 0)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{ padding: '4px 12px', color: '#16a34a', fontSize: 13, fontStyle: 'italic' }}>
                  ✍️ {typingUser} est en train d'écrire...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="chat-input-area" onSubmit={handleSendText}>
              <input
                type="text"
                className="input"
                placeholder="Écrivez un message..."
                value={text}
                onChange={handleTyping}
              />
              <button type="submit" className="btn btn-primary">
                <FaPaperPlane />
              </button>
            </form>
          </>
        ) : (
          <div className="chat-empty">
            <FaComments size={64} color="#d1fae5" />
            <p>Sélectionnez un contact pour commencer</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;