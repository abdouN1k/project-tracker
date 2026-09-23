import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaProjectDiagram, FaComments, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" fill="#dc2626" />
            <text x="16" y="12" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">CoSider</text>
            <text x="16" y="20" textAnchor="middle" fill="#86efac" fontSize="5" fontWeight="bold">Agrico</text>
            <text x="16" y="27" textAnchor="middle" fill="#86efac" fontSize="4">UEV</text>
          </svg>
          <div>
            <span style={{ color: '#dc2626', fontSize: 18, fontWeight: 700 }}>CoSider Agrico</span>
            <br />
            <span style={{ color: '#86efac', fontSize: 11, fontWeight: 500 }}>Unité Espaces Verts</span>
          </div>
        </div>
      </Link>
      <div className="navbar-links">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
          <FaHome /> Accueil
        </Link>
        <Link to="/projects" className={`nav-link ${isActive('/projects') ? 'active' : ''}`}>
          <FaProjectDiagram /> Projets
        </Link>
        <Link to="/chat" className={`nav-link ${isActive('/chat') ? 'active' : ''}`}>
          <FaComments /> Messages
        </Link>
        <span className="user-badge">👤 {user?.name} ({user?.role})</span>
        <button
          className="nav-link"
          onClick={handleLogout}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <FaSignOutAlt /> Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;