import React, { useState } from 'react';
import './Auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
   const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/reset-password/', {
        email,
        nome,
        nova_senha: novaSenha,
      });

      setMensagem(response.data.message);
    } catch (error) {
      setMensagem(error.response?.data?.error || 'Erro ao recuperar senha');
    }
  };

  return (
    <div className="auth-container">
      <h1>GYM</h1>
      <h2>Recuperar Palavra-passe</h2>

      <label>E-mail</label>
      <div className="input-container">
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
      </div>

      <label>Nome</label>
      <div className="input-container">
        <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      </div>

      <label>Nova Palavra-passe</label>
      <div className="input-container">
        <input type="password" placeholder="Nova senha" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} />
      </div>
      <br></br>
      <button className="auth-button" onClick={handleSubmit}>Alterar senha</button>
      {mensagem && <p style={{ marginTop: '10px', color: 'black' }}>{mensagem}</p>}
      <br></br>
      <button
        type="button"
        className="back"
        onClick={() => navigate(-1)}
      >
        Voltar atrás
      </button>
    </div>
  );
};

export default RecuperarSenha;
