import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, MessageSquare, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div className="flex justify-between items-center h-16" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          
          {/* Logo / Title */}
          <Link to="/dashboard" className="flex items-center space-x-2 no-underline" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <div className="flex flex-col" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="text-xl font-extrabold text-red-600 tracking-tight leading-none" style={{ fontSize: '20px', fontWeight: '800', color: '#dc2626', lineHeight: '1' }}>
                CoSider Agrico
              </span>
              <span className="text-xs font-semibold text-green-700 tracking-wider mt-1" style={{ fontSize: '12px', fontWeight: '600', color: '#15803d', marginTop: '4px' }}>
                Unité Espaces Verts
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 no-underline ${
                isActive('/dashboard')
                  ? 'bg-red-100 text-red-700 border border-red-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                backgroundColor: isActive('/dashboard') ? '#fee2e2' : 'transparent',
                color: isActive('/dashboard') ? '#b91c1c' : '#4b5563'
              }}
            >
              <LayoutDashboard size={18} />
              <span>Projets</span>
            </Link>

            <Link
              to="/chat"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 no-underline ${
                isActive('/chat')
                  ? 'bg-red-100 text-red-700 border border-red-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                backgroundColor: isActive('/chat') ? '#fee2e2' : 'transparent',
                color: isActive('/chat') ? '#b91c1c' : '#4b5563'
              }}
            >
              <MessageSquare size={18} />
              <span>Discussion</span>
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f9fafb', padding: '6px 12px', borderRadius: '9999px', border: '1px solid #e5e7eb' }}>
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#dc2626', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>
                {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
              </div>
              <div className="hidden sm:block text-left" style={{ textAlign: 'left' }}>
                <div className="text-xs font-bold text-gray-800 leading-tight" style={{ fontSize: '12px', fontWeight: '700', color: '#1f2937' }}>{user.name}</div>
                <div className="text-[10px] text-green-700 font-bold uppercase" style={{ fontSize: '10px', color: '#15803d', fontWeight: '700', textTransform: 'uppercase' }}>{user.role || 'Responsable Projet'}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
              style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Déconnexion"
            >
              <LogOut size={18} color="#4b5563" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
