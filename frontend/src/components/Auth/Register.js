import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLeaf, FaUser, FaEnvelope, FaLock, FaPhone, FaBriefcase, FaIdBadge } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', poste: '', role: 'Responsable Projet'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('Compte créé avec succès !');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in" style={{ maxWidth: 500 }}>
        <div className="auth-logo">
          <FaLeaf size={48} color="#16a34a" />
          <h1>CoSider Agrico UEV</h1>
          <p>Création d'un compte professionnel</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label"><FaUser /> Nom & Prénom</label>
              <input type="text" className="input" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label"><FaIdBadge /> Rôle</label>
              <select className="select" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option value="Responsable Projet">Responsable Projet</option>
                <option value="Directeur">Directeur</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label"><FaEnvelope /> Email</label>
              <input type="email" className="input" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label"><FaPhone /> N° Téléphone</label>
              <input type="tel" className="input" required onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label"><FaBriefcase /> Poste exact</label>
              <input type="text" className="input" required placeholder="Ex: Ingénieur Génie Civil" onChange={(e) => setFormData({...formData, poste: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label"><FaLock /> Mot de passe</label>
              <input type="password" className="input" required minLength={6} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 15 }} disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, color: '#6b7280' }}>
          Déjà inscrit ? <Link to="/login" style={{ color: '#16a34a', fontWeight: 600 }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;