import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';

const Header = () => {
  const [nomeUtilizador, setNomeUtilizador] = useState('');
  const navigate = useNavigate();

  // Carregar dados do utilizador (nome) ao carregar o componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/', { withCredentials: true });
        setNomeUtilizador(response.data.nome); // Atualiza o estado com o nome do utilizador
      } catch (error) {
        console.error('Erro ao carregar dados do utilizador:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8000/api/logout/', { withCredentials: true });
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      navigate('/');
    }
  };

  const handleProfile = () => {
    navigate('/perfil'); // Redirecionar para a página do perfil
  };

  return (
    <div className="top-bar">
      <h1>GYM</h1>
      <div className="user-actions">
        <span onClick={handleProfile} style={{ cursor: 'pointer' }}>🏋️‍♂️ {nomeUtilizador}</span>
        <button className="logout-btn" onClick={handleLogout}>Sair</button>
      </div>
    </div>
  );
};

export default Header;
