import React from 'react';
import './Auth.css';

const RecuperarSenha = () => {
  return (
    <div className="auth-container">
      <h1>GYM</h1>
      <h2>Mudança de senha</h2>

      <label>E-mail de verificação</label>
      <div className="input-container">
        <span className="icon">✉️</span>
        <input type="email" placeholder="E-mail de verificação" />
      </div>

      <button className="auth-button">Enviar</button>
    </div>
  );
};

export default RecuperarSenha;
