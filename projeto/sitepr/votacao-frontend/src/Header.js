import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';

const Header = () => {
  const [nomeUtilizador, setNomeUtilizador] = useState('');
  const [imagemPerfil, setImagemPerfil] = useState('');
  const navigate = useNavigate();

  // Carregar dados do utilizador (nome) ao carregar o componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/', { withCredentials: true });
        setNomeUtilizador(response.data.nome);
        if (response.data.imagem) {
          setImagemPerfil('http://localhost:8000' + response.data.imagem);
        } else {
          // Caminho para imagem padrão
          setImagemPerfil('http://localhost:8000/media/imagens_perfil/default.png');
        }
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
    <h1 
      className="gym-button" 
      onClick={() => navigate('/PaginaPrincipal')} 
      style={{ cursor: 'pointer' }}
    >
      GYM
    </h1>

    <div className="user-actions" onClick={handleProfile} style={{ cursor: 'pointer' }}>
      {imagemPerfil && (
        <img
          className="profile-img"
          src={imagemPerfil}
          alt="Perfil"
        />
      )}
      <span>{nomeUtilizador}</span>
    </div>
    <button className="logout-btn" onClick={handleLogout}>Sair</button>
  </div>
  );
};

export default Header;
