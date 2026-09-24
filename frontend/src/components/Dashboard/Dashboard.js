import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, FolderCheck, Clock, Users, Calendar, DollarSign, FileText, Trash2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://project-tracker-backend-85u8.onrender.com';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    ntProjet: '',
    title: '',
    montant: '',
    duree: '',
    dateDemarrage: '',
    description: '',
    articles: [{ designation: '', quantite: '' }]
  });

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddArticle = () => {
    setFormData({
      ...formData,
      articles: [...formData.articles, { designation: '', quantite: '' }]
    });
  };

  const handleRemoveArticle = (index) => {
    const newArticles = formData.articles.filter((_, i) => i !== index);
    setFormData({ ...formData, articles: newArticles });
  };

  const handleArticleChange = (index, field, value) => {
    const newArticles = [...formData.articles];
    newArticles[index][field] = value;
    setFormData({ ...formData, articles: newArticles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/api/projects`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setFormData({
        ntProjet: '',
        title: '',
        montant: '',
        duree: '',
        dateDemarrage: '',
        description: '',
        articles: [{ designation: '', quantite: '' }]
      });
      fetchProjects();
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">CoSider Agrico UEV - Projets</h1>
          <p className="text-sm text-gray-500">Gestion et suivi des espaces verts</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau Projet</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl"><FolderCheck className="w-8 h-8" /></div>
          <div>
            <div className="text-2xl font-black text-gray-900">{projects.length}</div>
            <div className="text-xs font-semibold text-gray-500 uppercase">Projets Totaux</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-xl"><Clock className="w-8 h-8" /></div>
          <div>
            <div className="text-2xl font-black text-gray-900">
              {projects.filter(p => p.status === 'En Cours').length}
            </div>
            <div className="text-xs font-semibold text-gray-500 uppercase">En Cours</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users className="w-8 h-8" /></div>
          <div>
            <div className="text-2xl font-black text-gray-900">CoSider UEV</div>
            <div className="text-xs font-semibold text-gray-500 uppercase">Unité Espaces Verts</div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-800">
          Liste des Projets
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-semibold">Aucun projet trouvé.</p>
            <p className="text-xs">Cliquez sur "Nouveau Projet" pour en créer un.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {projects.map((p) => (
              <div key={p._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="bg-red-100 text-red-800 text-xs font-extrabold px-2.5 py-1 rounded-md">
                        NT: {p.ntProjet}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">{p.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600">
                    <div className="flex items-center space-x-1"><DollarSign className="w-4 h-4 text-green-600" /><span>{p.montant} DZD</span></div>
                    <div className="flex items-center space-x-1"><Clock className="w-4 h-4 text-blue-600" /><span>{p.duree} Mois</span></div>
                    <div className="flex items-center space-x-1"><Calendar className="w-4 h-4 text-gray-500" /><span>{p.dateDemarrage ? new Date(p.dateDemarrage).toLocaleDateString() : ''}</span></div>
                  </div>
                </div>

                {/* Articles */}
                {p.articles && p.articles.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                    {p.articles.map((art, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-md">
                        {art.designation}: <strong>{art.quantite}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Nouveau Projet CoSider</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700">NT de Projet</label>
                  <input
                    type="text" required placeholder="ex: NT-2024-001"
                    value={formData.ntProjet} onChange={(e) => setFormData({...formData, ntProjet: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Intitulé du Projet</label>
                  <input
                    type="text" required placeholder="Intitulé"
                    value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Montant (DZD)</label>
                  <input
                    type="number" required placeholder="Montant"
                    value={formData.montant} onChange={(e) => setFormData({...formData, montant: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Durée (Mois)</label>
                  <input
                    type="text" required placeholder="ex: 6 Mois"
                    value={formData.duree} onChange={(e) => setFormData({...formData, duree: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">Date de Démarrage</label>
                  <input
                    type="date" required
                    value={formData.dateDemarrage} onChange={(e) => setFormData({...formData, dateDemarrage: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Description</label>
                <textarea
                  rows="2" placeholder="Description du projet..."
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm mt-1"
                ></textarea>
              </div>

              {/* Articles Section */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-700">Articles / Prestations</label>
                  <button
                    type="button" onClick={handleAddArticle}
                    className="text-xs font-bold text-red-600 hover:text-red-700"
                  >
                    + Ajouter Article
                  </button>
                </div>

                {formData.articles.map((art, idx) => (
                  <div key={idx} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text" placeholder="Désignation" required
                      value={art.designation} onChange={(e) => handleArticleChange(idx, 'designation', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg p-2 text-xs"
                    />
                    <input
                      type="text" placeholder="Quantité" required
                      value={art.quantite} onChange={(e) => handleArticleChange(idx, 'quantite', e.target.value)}
                      className="w-24 border border-gray-300 rounded-lg p-2 text-xs"
                    />
                    {formData.articles.length > 1 && (
                      <button type="button" onClick={() => handleRemoveArticle(idx)} className="p-1.5 text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 font-semibold">Annuler</button>
                <button type="submit" className="px-5 py-2 text-sm bg-red-600 text-white font-bold rounded-xl shadow-md">Enregistrer Projet</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;