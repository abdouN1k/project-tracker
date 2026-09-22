import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatRoom from '../components/Chat/ChatRoom';

const ChatPage = () => {
  const { API } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  }, [API]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <div style={{ width: '250px', borderRight: '1px solid #ccc' }}>
        <h3>المستخدمون</h3>
        <ul>
          {users.map((u) => (
            <li
              key={u._id}
              onClick={() => setSelectedUser(u)}
              style={{ cursor: 'pointer', padding: '5px 0' }}
            >
              {u.name}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1 }}>
        {selectedUser ? (
          <ChatRoom roomId={selectedUser._id} />
        ) : (
          <p>اختر مستخدماً لبدء المحادثة</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;