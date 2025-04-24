import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="top-bar">
  <h1>GYM</h1>
  <div className="user-actions">
    <span>🏋️‍♂️ Atleta X</span>
    <button className="logout-btn">Sair</button>
  </div>
</div>

  );
};

export default Header;
