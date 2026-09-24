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
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo / Header Title */}
          <Link to="/dashboard" className="flex items-center no-underline">
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-red-600 tracking-tight leading-none">
                CoSider Agrico
              </span>
              <span className="text-xs font-semibold text-green-700 tracking-wider mt-0.5">
                Unité Espaces Verts
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 no-underline ${
                isActive('/dashboard')
                  ? 'bg-red-50 text-red-700 font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Projets</span>
            </Link>

            <Link
              to="/chat"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 no-underline ${
                isActive('/chat')
                  ? 'bg-red-50 text-red-700 font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Discussion</span>
            </Link>
          </div>

          {/* User Profile & Logout Button */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold border border-red-200">
                {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-bold text-gray-800 leading-tight">{user.name}</div>
                <div className="text-xs text-gray-500 font-medium">{user.role}</div>
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