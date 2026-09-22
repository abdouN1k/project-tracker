import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import CreateTask from './CreateTask';
import toast from 'react-hot-toast';

const columns = [
  { id: 'todo', title: '📝 À faire' },
  { id: 'in-progress', title: '🔄 En cours' },
  { id: 'review', title: '👀 Review' },
  { id: 'done', title: '✅ Terminé' }
];

const TaskBoard = ({ projectId, tasks, setTasks, members }) => {
  const { API } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [currentCol, setCurrentCol] = useState('todo');

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const { data } = await API.put(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(prev => prev.map(t => t._id === taskId ? data : t));
      toast.success('Status t-bdal');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const { data } = await API.post('/tasks', { ...taskData, project: projectId, status: currentCol });
      setTasks([...tasks, data]);
      setShowCreate(false);
      toast.success('Task tcréat! 🎉');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  return (
    <div className="task-board">
      {columns.map(col => (
        <div key={col.id} className="task-column">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3>{col.title} ({tasks.filter(t => t.status === col.id).length})</h3>
            <button className="btn btn-secondary" style={{ padding: '2px 8px' }} onClick={() => { setCurrentCol(col.id); setShowCreate(true); }}>+</button>
          </div>

          {tasks.filter(t => t.status === col.id).map(task => (
            <div key={task._id} className="task-card">
              <h4>{task.title}</h4>
              <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0' }}>{task.description}</p>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                style={{ fontSize: 12, padding: 4, marginTop: 8, width: '100%' }}
              >
                <option value="todo">À faire</option>
                <option value="in-progress">En cours</option>
                <option value="review">Review</option>
                <option value="done">Terminé</option>
              </select>
            </div>
          ))}
        </div>
      ))}

      {showCreate && <CreateTask onClose={() => setShowCreate(false)} onSubmit={handleCreateTask} members={members} />}
    </div>
  );
};

export default TaskBoard;