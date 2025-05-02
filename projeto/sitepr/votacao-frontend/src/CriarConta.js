import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import eyeIcon from './imagens/eye.png';
import eyeOffIcon from './imagens/eye-off.png';

const CriarConta = () => {
  const [utilizador, setUtilizador] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const navigate = useNavigate();

  const validarEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleCriarConta = (e) => {
    e.preventDefault();
    if (!utilizador || !email || !senha || !confirmarSenha) {
      alert('Todos os campos são obrigatórios!');
    } else if (!validarEmail(email)) {
      alert('Introduza um e-mail válido!');
    } else if (senha !== confirmarSenha) {
      alert('As palavras-passe não coincidem!');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <h1>GYM</h1>
      <h2>Criar Conta</h2>
      <form onSubmit={handleCriarConta}>
        <label>Nome de utilizador</label>
        <div className="input-group">
          <span className="icon">👤</span>
          <input
            type="text"
            value={utilizador}
            onChange={(e) => setUtilizador(e.target.value)}
            placeholder="Nome de utilizador"
          />
        </div>

        <label>E-mail</label>
        <div className="input-group">
          <span className="icon">✉️</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
          />
        </div>

        <label>Senha</label>
        <div className="input-group">
          <span className="icon">🔒</span>
          <input
            type={mostrarSenha ? 'text' : 'password'}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
          />
          <img
            src={mostrarSenha ? eyeIcon : eyeOffIcon}
            alt="Mostrar senha"
            className="icon-eye"
            onClick={() => setMostrarSenha(!mostrarSenha)}
          />
        </div>

        <label>Confirmar senha</label>
        <div className="input-group">
          <span className="icon">🔒</span>
          <input
            type={mostrarConfirmar ? 'text' : 'password'}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="Confirmar senha"
          />
          <img
            src={mostrarConfirmar ? eyeIcon : eyeOffIcon}
            alt="Mostrar senha"
            className="icon-eye"
            onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
          />
        </div>

        <button type="submit">Criar Conta</button>
      </form>
    </div>
  );
};

export default CriarConta;
