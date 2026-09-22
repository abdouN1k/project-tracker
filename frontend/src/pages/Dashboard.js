import { useState, useEffect, useCallback } from 'react';
import { FaProjectDiagram, FaUsers, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, API } = useAuth();
  const [stats, setStats] = useState({ projects: 0, users: 0, completed: 0, inProgress: 0 });
  const [recentProjects, setRecentProjects] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [projRes, usersRes] = await Promise.all([
        API.get('/projects'),
        API.get('/users')
      ]);
      const projects = projRes.data;
      setStats({
        projects: projects.length,
        users: usersRes.data.length + 1,
        completed: projects.filter(p => p.status === 'Terminé').length,
        inProgress: projects.filter(p => p.status === 'En cours').length
      });
      setRecentProjects(projects.slice(0, 6));
    } catch (err) {
      console.error(err);
    }
  }, [API]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bienvenue, {user?.name} 👋</h1>
          <p className="page-subtitle">Aperçu de votre plateforme CoSider Agrico UEV</p>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 32 }}>
        <div className="stat-card green">
          <FaProjectDiagram size={32} />
          <div className="stat-number">{stats.projects}</div>
          <div className="stat-label">Projets Totaux</div>
        </div>
        <div className="stat-card blue">
          <FaUsers size={32} />
          <div className="stat-number">{stats.users}</div>
          <div className="stat-label">Membres</div>
        </div>
        <div className="stat-card orange">
          <FaClock size={32} />
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">En Cours</div>
        </div>
        <div className="stat-card purple">
          <FaCheckCircle size={32} />
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Terminés</div>
        </div>
      </div>

      <h2 style={{ marginBottom: 16, color: '#14532d' }}>📊 Projets Récents</h2>
      <div className="grid grid-2">
        {recentProjects.map((project) => (
          <div key={project._id} className="project-card">
            <div className="project-header">
              <div className="project-title">{project.title}</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>Par {project.owner?.name}</div>
            </div>
            <div className="project-body">
              <p className="project-description">{project.description}</p>
              <div className="project-meta">
                <span className={`badge badge-${project.status === 'Terminé' ? 'success' : project.status === 'En cours' ? 'info' : 'warning'}`}>
                  {project.status}
                </span>
                <span>{project.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;