import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import eyeIcon from './imagens/eye.png';
import eyeOffIcon from './imagens/eye-off.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !senha.trim()) {
      alert('Preencha todos os campos!');
      return;
    }

    // Enviar dados para a API de login no Django
    const response = await fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // <-- esta linha é ESSENCIAL
      body: JSON.stringify({
        email: email,
        password: senha,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Login bem-sucedido
      alert(data.message); // Mostrar mensagem de sucesso
      navigate('/PaginaPrincipal'); // Redirecionar para a página principal
    } else {
      // Erro no login
      alert(data.error); // Mostrar mensagem de erro
    }
  };

  return (
    <div className="auth-container">
      <h1>GYM</h1>
      <h2>Iniciar Sessão</h2>
      <form onSubmit={handleLogin}>
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
