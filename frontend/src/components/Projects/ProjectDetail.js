import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TaskBoard from '../Tasks/TaskBoard';
import ChatRoom from '../Chat/ChatRoom';
import toast from 'react-hot-toast';

const ProjectDetail = () => {
  const { id } = useParams();
  const { API } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('board');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data } = await API.get(`/projects/${id}`);
      setProject(data.project);
      setTasks(data.tasks);
    } catch (error) {
      toast.error('Ma9derch njib project');
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <Link to="/projects" style={{ color: '#4F46E5', textDecoration: 'none', fontSize: 14 }}>← Rj3 l Projects</Link>
      <h1 style={{ marginTop: 8 }}>{project.name}</h1>
      <p style={{ color: '#6B7280', marginBottom: 20 }}>{project.description}</p>

      <div style={{ display: 'flex', gap: 10, borderBottom: '2px solid #E5E7EB', marginBottom: 20 }}>
        <button className={`btn ${activeTab === 'board' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('board')}>
          📋 Task Board
        </button>
        <button className={`btn ${activeTab === 'chat' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('chat')}>
          💬 Chat
        </button>
      </div>

      {activeTab === 'board' && <TaskBoard projectId={id} tasks={tasks} setTasks={setTasks} members={project.members} />}
      {activeTab === 'chat' && <ChatRoom conversationId={`project_${id}`} />}
    </div>
  );
};

export default ProjectDetail;