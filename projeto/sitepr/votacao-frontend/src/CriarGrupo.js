import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import './CriarGrupo.css';

const CriarGrupo = () => {
  const [nome, setNome] = useState('');
  const [imagem, setImagem] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/user/', { withCredentials: true })
      .then(res => {
        setUserId(res.data.id);
      })
      .catch(err => console.error("Erro ao obter ID do usuário:", err));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagem(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !imagem) {
      alert('Preencha o nome e selecione uma imagem.');
      return;
    }

    if (!userId) {
      alert('Usuário não identificado. Aguarde o carregamento ou faça login.');
      return;
    }

    try {
      // Envia a imagem e obtém o nome salvo
      const imageFormData = new FormData();
      imageFormData.append('file', imagem);

      const uploadRes = await axios.post('http://127.0.0.1:8000/api/uploads/', imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      const avatarFileName = uploadRes.data.filename;

      // Cria o grupo com nome, avatar e ID do criador
      await axios.post(
        'http://127.0.0.1:8000/api/chats/create_group/',
        {
          nome,
          avatar: avatarFileName,
          participants: [userId],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      alert('Grupo criado com sucesso!');
      setNome('');
      setImagem(null);
      setPreviewUrl('');
    } catch (err) {
      console.error('Erro ao criar grupo:', err);
      alert('Erro ao criar o grupo. Verifique o console para mais detalhes.');
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <div className="criar-grupo-container">
        <h1>Criar Grupo</h1>
        <form onSubmit={handleSubmit}>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label>Imagem:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Pré-visualização"
              className="preview-image"
            />
          )}

          <button type="submit">Criar Grupo</button>
        </form>
      </div>
    </>
  );
};

export default CriarGrupo;
