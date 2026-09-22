import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CreateProject from './CreateProject';
import toast from 'react-hot-toast';

const ProjectList = () => {
  const { API } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch (error) {
      toast.error('Erreur f chargement');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>📁 Les Projets</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ Project Jdid</button>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <Link to={`/projects/${project._id}`} key={project._id} className="project-card" style={{ borderLeftColor: project.color }}>
            <h3>{project.name}</h3>
            <p style={{ color: '#6B7280', fontSize: 14, margin: '8px 0' }}>{project.description}</p>
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

      {showCreate && (
        <CreateProject onClose={() => setShowCreate(false)} onCreated={(p) => { setProjects([p, ...projects]); setShowCreate(false); toast.success('Project tcrea! 🎉'); }} />
      )}
    </div>
  );
};

export default ProjectList;