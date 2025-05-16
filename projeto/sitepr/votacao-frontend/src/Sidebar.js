import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <nav className="nav-links">
        <Link to="/PaginaPrincipal" className={location.pathname === '/PaginaPrincipal' ? 'active' : ''}>
          🏠 Página Principal
        </Link>
        <br/>
        <Link to="/Marcacoes" className={location.pathname === '/Marcacoes' ? 'active' : ''}>
          Marcações
        </Link>
        <br/>
        <Link to="/Mensagens" className={location.pathname === '/Mensagens' ? 'active' : ''}>
          Mensagens
        </Link>
        <br/>
        <Link to="/CriarAula" className={location.pathname === '/CriarAula' ? 'active' : ''}>
          Criar Aula
        </Link>
        <br/>
      </nav>
    </div>
  );
};

export default Sidebar;

