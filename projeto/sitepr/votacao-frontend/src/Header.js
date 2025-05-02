import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); 
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
