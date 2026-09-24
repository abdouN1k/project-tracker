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
    <header className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo / Header Title */}
          <Link to="/dashboard" className="flex items-center space-x-2 no-underline">
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-red-600 tracking-tight leading-none">
                CoSider Agrico
              </span>
              <span className="text-xs font-semibold text-green-700 tracking-wider mt-1">
                Unité Espaces Verts
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                isActive('/dashboard')
                  ? 'bg-red-100 text-red-700 border border-red-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Projets</span>
            </Link>

            <Link
              to="/chat"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                isActive('/chat')
                  ? 'bg-red-100 text-red-700 border border-red-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Discussion</span>
            </Link>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-gray-800 leading-tight">{user.name}</div>
                <div className="text-[10px] text-green-700 font-bold uppercase">{user.role || 'Responsable Projet'}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;