import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8000/api/logout/', { withCredentials: true }); // se usares cookies
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      navigate('/'); // mesmo com erro, redireciona
    }
  };

  return (
    <div className="top-bar">
      <h1>GYM</h1>
      <div className="user-actions">
        <span>🏋️‍♂️ Atleta X</span>
        <button className="logout-btn" onClick={handleLogout}>Sair</button>
      </div>
    </div>
  );
};

export default Header;
