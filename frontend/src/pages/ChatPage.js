import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatRoom from '../components/Chat/ChatRoom';

const ChatPage = () => {
  const { API } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);

  useEffect(() => {
    API.get('/projects').then(({ data }) => {
      setProjects(data);
      if (data.length > 0) setSelectedConv(`project_${data[0]._id}`);
    });
  }, []);

  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <h3>💬 Chat</h3>
        <p style={{ fontSize: 12, color: '#6B7280', margin: '10px 0' }}>Projects</p>
        {projects.map(p => (
          <div
            key={p._id}
            onClick={() => setSelectedConv(`project_${p._id}`)}
            style={{
              padding: '10px',
              borderRadius: 8,
              cursor: 'pointer',
              background: selectedConv === `project_${p._id}` ? '#EEF2FF' : 'transparent',
              marginBottom: 4
            }}
          >
            <strong>{p.name}</strong>
          </div>
        ))}
      </div>

      <div className="chat-area">
        {selectedConv ? <ChatRoom conversationId={selectedConv} /> : <div style={{ padding: 20 }}>Select conversation</div>}
      </div>
    </div>
  );
};

export default ChatPage;