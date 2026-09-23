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
    <nav className="navbar" style={{ background: '#ffffff', borderBottom: '3px solid #16a34a' }}>
      <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
        <div>
          <div style={{ color: '#dc2626', fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>
            CoSider Agrico
          </div>
          <div style={{ color: '#16a34a', fontSize: 12, fontWeight: 600 }}>
            Unité Espaces Verts
          </div>
        </div>
      </Link>

      <div className="navbar-links">
        <Link to="/" className={
av-link \}>
          <FaHome /> <span>Accueil</span>
        </Link>
        <Link to="/projects" className={
av-link \}>
          <FaProjectDiagram /> <span>Projets</span>
        </Link>
        <Link to="/chat" className={
av-link \}>
          <FaComments /> <span>Messages</span>
        </Link>

        <span className="user-badge" style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
          ?? {user?.name}
        </span>

        <button className="nav-link" onClick={handleLogout} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <FaSignOutAlt color="#dc2626" /> <span style={{ color: '#dc2626' }}>Quitter</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
