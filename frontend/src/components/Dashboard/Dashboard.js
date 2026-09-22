import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { API, user } = useAuth();
  const { onlineUsers } = useSocket();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch (error) {
      toast.error('Ma9derch njib data');
    }
  };

  return (
    <div className="dashboard">
      <div style={{ marginBottom: 24 }}>
        <h1>Mra7ba, {user?.name}! 👋</h1>
        <p style={{ color: '#6B7280' }}>Hana résumé dyal l projets dyalk</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span style={{ fontSize: 32 }}>📁</span>
          <div>
            <h3>{projects.length}</h3>
            <p style={{ color: '#6B7280', fontSize: 14 }}>Total Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <span style={{ fontSize: 32 }}>🔄</span>
          <div>
            <h3>{projects.filter(p => p.status === 'in-progress').length}</h3>
            <p style={{ color: '#6B7280', fontSize: 14 }}>En cours</p>
          </div>
        </div>

        <div className="stat-card">
          <span style={{ fontSize: 32 }}>✅</span>
          <div>
            <h3>{projects.filter(p => p.status === 'completed').length}</h3>
            <p style={{ color: '#6B7280', fontSize: 14 }}>Terminés</p>
          </div>
        </div>

        <div className="stat-card">
          <span style={{ fontSize: 32 }}>👥</span>
          <div>
            <h3>{onlineUsers.length}</h3>
            <p style={{ color: '#6B7280', fontSize: 14 }}>En ligne</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Projets Récents</h2>
        <Link to="/projects" className="btn btn-secondary">Chouf ga3</Link>
      </div>

      <div className="projects-grid">
        {projects.slice(0, 6).map(project => (
          <Link to={`/projects/${project._id}`} key={project._id} className="project-card" style={{ borderLeftColor: project.color }}>
            <h3>{project.name}</h3>
            <p style={{ color: '#6B7280', fontSize: 14, margin: '8px 0' }}>{project.description || 'Pas de description'}</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7280' }}>
              <span>👥 {project.members?.length} members</span>
              <span>{project.progress}%</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;