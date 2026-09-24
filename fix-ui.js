const fs = require('fs');
const path = require('path');

// 1. Navbar.js
const navbarContent = `import React from 'react';
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
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        height: '64px'
      }}>

        {/* Logo / Header Title */}
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#dc2626', lineHeight: '1.1' }}>
              CoSider Agrico
            </span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#15803d', marginTop: '2px', letterSpacing: '0.5px' }}>
              Unité Espaces Verts
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/dashboard"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              backgroundColor: isActive('/dashboard') ? '#fee2e2' : 'transparent',
              color: isActive('/dashboard') ? '#b91c1c' : '#4b5563',
              border: isActive('/dashboard') ? '1px solid #fca5a5' : '1px solid transparent'
            }}
          >
            <LayoutDashboard size={18} />
            <span>Projets</span>
          </Link>

          <Link
            to="/chat"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              backgroundColor: isActive('/chat') ? '#fee2e2' : 'transparent',
              color: isActive('/chat') ? '#b91c1c' : '#4b5563',
              border: isActive('/chat') ? '#fca5a5' : '1px solid transparent'
            }}
          >
            <MessageSquare size={18} />
            <span>Discussion</span>
          </Link>
        </div>

        {/* User Profile & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f9fafb',
            padding: '6px 12px',
            borderRadius: '9999px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              fontWeight: '700',
              fontSize: '14px'
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#1f2937' }}>{user.name}</div>
              <div style={{ fontSize: '10px', color: '#15803d', fontWeight: '700', textTransform: 'uppercase' }}>
                {user.role || 'Responsable Projet'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: '8px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}
            title="Déconnexion"
          >
            <LogOut size={18} color="#4b5563" />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
`;

// 2. index.css (مع إضافة قواعد CSS إجبارية باش تحمي التصميم حتى لو تفشل Tailwind)
const indexCssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  background-color: #f9fafb;
}

a {
  text-decoration: none !important;
}
`;

// 3. package.json نقي بدقة
const packageJsonContent = JSON.stringify({
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.6.8",
    "lucide-react": "^0.359.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3",
    "react-scripts": "5.0.1",
    "socket.io-client": "^4.7.5",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}, null, 2);

// تنفيذ الكتابة الشاملة والمضمونة
try {
  fs.writeFileSync(path.join(__dirname, 'frontend/src/components/Layout/Navbar.js'), navbarContent);
  console.log('✅ Navbar.js mis à jour sans aucun doublon.');

  fs.writeFileSync(path.join(__dirname, 'frontend/src/index.css'), indexCssContent);
  console.log('✅ index.css mis à jour.');

  fs.writeFileSync(path.join(__dirname, 'frontend/package.json'), packageJsonContent);
  console.log('✅ package.json nettoyé.');

  console.log('🚀 Opération réussie ! Vous pouvez pousser sur Git maintenant.');
} catch (err) {
  console.error('❌ Erreur lors de l’écriture :', err);
}