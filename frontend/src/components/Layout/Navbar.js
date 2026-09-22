import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { onlineUsers } = useSocket();

  return (
    <div className="navbar">
      <div className="navbar-search">
        <input type="text" placeholder="🔍 9lleb..." />
      </div>

      <div className="navbar-right">
        <div className="online-count">
          <span className="online-dot"></span>
          {onlineUsers.length} online
        </div>

        <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 500 }}>{user?.name}</span>
          <button onClick={logout} className="btn-logout">
            Sortir
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;