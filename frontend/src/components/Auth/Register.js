import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaBriefcase, FaIdBadge } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    poste: '',
    role: 'Responsable Projet'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('Compte professionnel créé avec succès !');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in" style={{ maxWidth: 540 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ color: '#dc2626', fontSize: 24, fontWeight: 800 }}>CoSider Agrico</div>
          <div style={{ color: '#16a34a', fontSize: 14, fontWeight: 600 }}>Unité Espaces Verts</div>
        </div>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 20, fontSize: 14 }}>
          Création de compte professionnel (CoSider Agrico)
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label"><FaUser /> Nom & Prénom</label>
              <input
                type="text"
                className="input"
                required
                placeholder="Ex: Mohamed Benali"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label"><FaIdBadge /> Rôle dans l'entreprise</label>
              <select
                className="select"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
              >
                <option value="Responsable Projet">Responsable Projet</option>
                <option value="Directeur">Directeur</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label"><FaEnvelope /> Email professionnel</label>
              <input
                type="email"
                className="input"
                required
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label"><FaPhone /> N° Téléphone</label>
              <input
                type="tel"
                className="input"
                required
                placeholder="06XX XX XX XX"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label"><FaBriefcase /> Poste exact</label>
              <input
                type="text"
                className="input"
                required
                placeholder="Ex: Chef de Projet / Ingénieur"
                value={formData.poste}
                onChange={(e) => handleChange('poste', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label"><FaLock /> Mot de passe</label>
              <input
                type="password"
                className="input"
                required
                minLength={6}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 15, height: 45 }}
            disabled={loading}
          >
            {loading ? 'Création en cours...' : 'S\'inscrire'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#6b7280' }}>
          Déjà inscrit ?{' '}
          <Link to="/login" style={{ color: '#16a34a', fontWeight: 700 }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;