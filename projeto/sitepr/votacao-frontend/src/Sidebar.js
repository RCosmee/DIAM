import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [tipoConta, setTipoConta] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/user/', { withCredentials: true })
      .then(res => {
        setTipoConta(res.data.tipo_conta);
      })
      .catch(err => {
        console.error('Erro ao buscar tipo de conta:', err);
      });
  }, []);

  return (
    <div className="sidebar">
      <nav className="nav-links">
        <Link to="/PaginaPrincipal" className={location.pathname === '/PaginaPrincipal' ? 'active' : ''}>
          🏠 Página Principal
        </Link>
        <br />

        {tipoConta === 'Atleta' && (
          <>
            <Link to="/Marcacoes" className={location.pathname === '/Marcacoes' ? 'active' : ''}>
              Marcações
            </Link>
            <br />
            <Link to="/MinhasMarcacoes" className={location.pathname === '/MinhasMarcacoes' ? 'active' : ''}>
              Minhas Marcações
            </Link>
          </>
        )}

        {tipoConta === 'Personal Trainer' && (
          <>
            <Link to="/CriarAula" className={location.pathname === '/CriarAula' ? 'active' : ''}>
              Criar Aula
            </Link>
            <br />
            <Link to="/CriarGrupo" className={location.pathname === '/CriarGrupo' ? 'active' : ''}>
              Criar Grupo
            </Link>
          </>
        )}

        <br />
        <Link to="/Mensagens" className={location.pathname === '/Mensagens' ? 'active' : ''}>
          Mensagens
        </Link>
        <br />
      </nav>
    </div>
  );
};

export default Sidebar;
