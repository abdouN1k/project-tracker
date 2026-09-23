import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Connexion réussie !');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-logo" style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ margin: 0, lineHeight: 1.2 }}>
            <span style={{ color: '#dc2626', fontWeight: 800 }}>CoSider Agrico</span>
          </h1>
          <h2 style={{ margin: '6px 0 0', color: '#16a34a', fontWeight: 700, fontSize: 20 }}>
            Unité Espaces Verts
          </h2>
          <p style={{ marginTop: 8, color: '#6b7280' }}>Connectez-vous à votre compte</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label"><FaEnvelope /> Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label"><FaLock /> Mot de passe</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#6b7280' }}>
          Pas de compte ?{' '}
          <Link to="/register" style={{ color: '#16a34a', fontWeight: 600 }}>
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;