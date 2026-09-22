import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const Dashboard = () => {
  const { user, API } = useAuth();
  const { onlineUsers } = useSocket();
  const [projects, setProjects] = useState([]);

  const fetchProjects = useCallback(async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  }, [API]);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>مرحباً، {user?.name}</h2>
      <div style={{ marginTop: '20px' }}>
        <h3>المشاريع المتاحة: {projects.length}</h3>
        <h3>المستخدمون المتصلون: {onlineUsers.length}</h3>
      </div>
    </div>
  );
};

export default Dashboard;