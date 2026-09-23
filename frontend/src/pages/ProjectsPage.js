import { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaTrash, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ProjectsPage = () => {
  const { user, API } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', description: '', status: 'En cours', category: 'Agriculture' });

  const fetchProjects = useCallback(async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data || []);
    } catch (err) { console.error(err); }
  }, [API]);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/projects', form);
      toast.success('Projet créé !');
      setForm({ title: '', description: '', status: 'En cours', category: 'Agriculture' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      toast.error('Erreur lors de la création');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce projet ?')) return;
    try {
      await API.delete(`/projects/${id}`);
      toast.success('Projet supprimé');
      fetchProjects();
    } catch (err) {
      toast.error('Erreur');
    }
  };

  // Hada houa l'isla7 dial l'error 'toLowerCase' (protection m3a (p.title || ''))
  const filtered = projects.filter(p =>
    (p?.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (p?.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">🌾 Tous les Projets - CoSider Agrico UEV</h1>
          <p className="page-subtitle">Découvrez les projets de la communauté</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FaPlus /> Nouveau Projet
        </button>
      </div>

      <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <FaSearch color="#16a34a" />
        <input
          type="text"
          className="input"
          placeholder="Rechercher un projet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: 'none', padding: 8 }}
        />
      </div>

      {showForm && (
        <div className="card fade-in" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 16, color: '#16a34a' }}>Créer un projet</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Titre</label>
              <input type="text" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="textarea" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Statut</label>
                <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option>En cours</option>
                  <option>Terminé</option>
                  <option>En attente</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Catégorie</label>
                <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option>Agriculture</option>
                  <option>Élevage</option>
                  <option>Irrigation</option>
                  <option>Général</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Créer</button>
          </form>
        </div>
      )}

      <div className="grid grid-2">
        {filtered.map((project) => (
          <div key={project._id} className="project-card">
            <div className="project-header">
              <div className="project-title">{project.title || 'Sans titre'}</div>
              <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>
                👤 {project.owner?.name || 'Inconnu'} • {project.createdAt ? new Date(project.createdAt).toLocaleDateString('fr-FR') : ''}
              </div>
            </div>
            <div className="project-body">
              <p className="project-description">{project.description || 'Pas de description'}</p>
              <div className="project-meta">
                <span className={`badge badge-${project.status === 'Terminé' ? 'success' : project.status === 'En cours' ? 'info' : 'warning'}`}>
                  {project.status || 'En cours'}
                </span>
                <span className="badge badge-success">{project.category || 'Général'}</span>
              </div>
              {project.owner?._id === user?._id && (
                <button className="btn btn-danger" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }} onClick={() => handleDelete(project._id)}>
                  <FaTrash /> Supprimer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: '#6b7280' }}>Aucun projet trouvé</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;