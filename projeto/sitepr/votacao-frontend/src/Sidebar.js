import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <nav className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          🏠 Página Principal
        </Link>
        <Link to="/Marcacoes" className={location.pathname === '/Marcacoes' ? 'active' : ''}>
          Marcações
        </Link>
        <Link to="/Mensagens" className={location.pathname === '/Mensagens' ? 'active' : ''}>
          Mensagens
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
