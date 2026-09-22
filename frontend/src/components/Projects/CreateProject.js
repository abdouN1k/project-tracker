import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const CreateProject = ({ onClose, onCreated }) => {
  const { API } = useAuth();
  const [form, setForm] = useState({ name: '', description: '', priority: 'medium', color: '#4F46E5' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/projects', form);
      onCreated(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>🆕 Project Jdid</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <div className="form-group">
            <label>Smiyt l Project</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary">Créer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;