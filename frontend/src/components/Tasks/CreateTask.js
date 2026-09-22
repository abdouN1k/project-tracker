import { useState } from 'react';

const CreateTask = ({ onClose, onSubmit, members }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, assignedTo: assignedTo || undefined });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>🆕 Task Jdida</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <div className="form-group">
            <label>Titre</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="form-group">
            <label>Assigné à</label>
            <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
              <option value="">-- personne --</option>
              {members?.map(m => (
                <option key={m.user?._id} value={m.user?._id}>{m.user?.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary">Créer Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;