import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [utilizador, setUtilizador] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (utilizador.trim() && senha.trim()) {
      navigate('/paginaPrincipal');
    } else {
      alert('Preencha todos os campos!');
    }
  };

  return (
    <div className="auth-container">
      <h1>GYM</h1>
      <h2>Iniciar Sessão</h2>
      <form onSubmit={handleLogin}>
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

        <label>Senha</label>
        <div className="input-group">
          <span className="icon">🔒</span>
          <input
            type={mostrarSenha ? 'text' : 'password'}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
          />
          <span
            className="toggle-password"
            onClick={() => setMostrarSenha(!mostrarSenha)}
          >
            👁️
          </span>
        </div>

        <div className="esqueceu-senha">
          <a href="/esqueceuSenha">Esqueceu-se da senha?</a>
        </div>

        <button type="submit">Iniciar Sessão</button>

        <div className="criar-conta-link">
          <p>Não tens conta?</p>
          <a href="/criarConta">Criar Conta</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
