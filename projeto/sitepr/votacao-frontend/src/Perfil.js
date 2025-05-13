import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Perfil.css';

const Perfil = () => {
  const [nome, setNome] = useState('');
  const [imagem, setImagem] = useState(null);

  // Carregar dados do utilizador ao carregar a página
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/', { withCredentials: true });
        setNome(response.data.nome);
        setImagem(response.data.imagem); // Supondo que a imagem esteja no objeto de resposta
      } catch (error) {
        console.error('Erro ao carregar dados do utilizador:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleImageChange = (e) => {
    setImagem(URL.createObjectURL(e.target.files[0])); // Atualiza a imagem localmente
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('nome', nome);
      if (imagem) formData.append('imagem', imagem); // Envia a nova imagem, se existir

      const response = await axios.post('http://localhost:8000/api/user/update/', formData, { withCredentials: true });
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil');
    }
  };

  return (
    <div className="perfil-container">
      <h1>Meu Perfil</h1>
      <div className="perfil-form">
        <label>Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <label>Imagem de Perfil</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagem && <img src={imagem} alt="Imagem de perfil" className="perfil-image" />}

        <button onClick={handleSave}>Salvar</button>
      </div>
    </div>
  );
};

export default Perfil;
