import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLeaf, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
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
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <FaLeaf size={48} color="#16a34a" />
          <h1>CoSider Agrico UEV</h1>
          <p>Créez votre compte</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label"><FaUser /> Nom complet</label>
            <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Votre nom" />
          </div>
          <div className="form-group">
            <label className="form-label"><FaEnvelope /> Email</label>
            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="votre@email.com" />
          </div>
          <div className="form-group">
            <label className="form-label"><FaLock /> Mot de passe</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Création...' : 'Créer un compte'}
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