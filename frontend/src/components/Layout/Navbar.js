import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaLeaf, FaHome, FaProjectDiagram, FaComments, FaSignOutAlt } from 'react-icons/fa';
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
        <FaLeaf size={24} />
        <span>CoSider Agrico UEV</span>
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
        <span className="user-badge">👤 {user?.name}</span>
        <button className="nav-link" onClick={handleLogout} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <FaSignOutAlt /> Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;