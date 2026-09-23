import { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaTrash, FaSearch, FaFileInvoiceDollar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ProjectsPage = () => {
  const { user, API } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  // Nouveaux champs du projet
  const [form, setForm] = useState({
    ntProjet: '',
    title: '',
    description: '',
    montant: '',
    duree: '',
    dateDemarrage: '',
    status: 'En cours',
    articles: [{ designation: '', quantite: '' }]
  });

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

  const handleAddArticle = () => {
    setForm({ ...form, articles: [...form.articles, { designation: '', quantite: '' }] });
  };

  const handleArticleChange = (index, field, value) => {
    const newArticles = [...form.articles];
    newArticles[index][field] = value;
    setForm({ ...form, articles: newArticles });
  };

  const handleRemoveArticle = (index) => {
    const newArticles = form.articles.filter((_, i) => i !== index);
    setForm({ ...form, articles: newArticles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/projects', form);
      toast.success('Projet créé avec succès !');
      setForm({
        ntProjet: '', title: '', description: '', montant: '', duree: '', dateDemarrage: '', status: 'En cours',
        articles: [{ designation: '', quantite: '' }]
      });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      toast.error('Erreur lors de la création du projet');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce projet ?')) return;
    try {
      await API.delete(`/projects/${id}`);
      toast.success('Projet supprimé');
      fetchProjects();
    } catch (err) {
      toast.error('Erreur de suppression');
    }
  };

  const filtered = projects.filter(p =>
    (p?.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (p?.ntProjet || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">🌾 Suivi des Projets (Marchés)</h1>
          <p className="page-subtitle">Gestion technique et financière des projets CoSider Agrico UEV</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FaPlus /> {showForm ? 'Fermer' : 'Nouveau Projet'}
        </button>
      </div>

      <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <FaSearch color="#16a34a" />
        <input
          type="text"
          className="input"
          placeholder="Rechercher par Intitulé ou NT de projet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: 'none', padding: 8 }}
        />
      </div>

      {showForm && (
        <div className="card fade-in" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 16, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaFileInvoiceDollar /> Fiche de Création du Projet
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">NT de Projet</label>
                <input type="text" className="input" value={form.ntProjet} onChange={(e) => setForm({ ...form, ntProjet: e.target.value })} required placeholder="Ex: NT-2023-045" />
              </div>
              <div className="form-group">
                <label className="form-label">Intitulé du Projet</label>
                <input type="text" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Montant du Projet (DZD/EUR)</label>
                <input type="number" className="input" value={form.montant} onChange={(e) => setForm({ ...form, montant: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Durée du Projet</label>
                <input type="text" className="input" value={form.duree} onChange={(e) => setForm({ ...form, duree: e.target.value })} required placeholder="Ex: 12 Mois" />
              </div>
              <div className="form-group">
                <label className="form-label">Date de démarrage</label>
                <input type="date" className="input" value={form.dateDemarrage} onChange={(e) => setForm({ ...form, dateDemarrage: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Statut</label>
                <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option>En cours</option>
                  <option>En attente</option>
                  <option>Terminé</option>
                </select>
              </div>
            </div>

            <hr style={{ margin: '20px 0', borderTop: '1px solid #d1fae5' }} />

            <h4 style={{ marginBottom: 12, color: '#15803d' }}>📋 Détail Quantitatif et Estimatif (Articles des travaux)</h4>

            {form.articles.map((article, index) => (
              <div key={index} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Désignation de l'article"
                  style={{ flex: 2 }}
                  value={article.designation}
                  onChange={(e) => handleArticleChange(index, 'designation', e.target.value)}
                  required
                />
                <input
                  type="number"
                  className="input"
                  placeholder="Quantité Contrat"
                  style={{ flex: 1 }}
                  value={article.quantite}
                  onChange={(e) => handleArticleChange(index, 'quantite', e.target.value)}
                  required
                />
                {form.articles.length > 1 && (
                  <button type="button" className="btn btn-danger" onClick={() => handleRemoveArticle(index)}>X</button>
                )}
              </div>
            ))}

            <button type="button" className="btn btn-outline" onClick={handleAddArticle} style={{ marginBottom: 20 }}>
              + Ajouter un article
            </button>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>
              Enregistrer le Projet
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-2">
        {filtered.map((project) => (
          <div key={project._id} className="project-card">
            <div className="project-header">
              <div className="project-title">{project.title || 'Projet Ancien'}</div>
              <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>
                <strong>{project.ntProjet || 'NT-XXX'}</strong> • {project.dateDemarrage ? new Date(project.dateDemarrage).toLocaleDateString('fr-FR') : 'Date non définie'}
              </div>
            </div>
            <div className="project-body">
              <div style={{ marginBottom: 15, fontSize: 14 }}>
                <div>💰 <strong>Montant:</strong> {project.montant ? project.montant.toLocaleString() : '0'}</div>
                <div>⏳ <strong>Durée:</strong> {project.duree || 'N/A'}</div>
                <div>👷 <strong>Responsable:</strong> {project.owner?.name || 'Inconnu'}</div>
              </div>

              <details style={{ background: '#f0fdf4', padding: 10, borderRadius: 8, border: '1px solid #d1fae5', marginBottom: 15 }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#16a34a' }}>Voir les articles ({project.articles?.length || 0})</summary>
                <ul style={{ marginTop: 10, fontSize: 13, paddingLeft: 20 }}>
                  {project.articles?.map((art, i) => (
                    <li key={i}>{art.designation} : <strong>{art.quantite}</strong></li>
                  ))}
                </ul>
              </details>

              <div className="project-meta">
                <span className={`badge badge-${project.status === 'Terminé' ? 'success' : project.status === 'En cours' ? 'info' : 'warning'}`}>
                  {project.status || 'En cours'}
                </span>
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
    </div>
  );
};

export default ProjectsPage;