import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Perfil.css';

const Perfil = () => {
  const [nome, setNome] = useState('');
  const [imagem, setImagem] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();

  const USER_URL = 'http://localhost:8000/api/user/';
  const PROFILE_URL = 'http://localhost:8000/api/profile/';

  // Obter CSRF token dos cookies
  const getCSRFToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
  };

  // Carregar dados do utilizador
  useEffect(() => {
    axios.get(USER_URL, { withCredentials: true })
      .then(res => {
        setNome(res.data.nome);
        if (res.data.imagem) {
          setPreviewUrl('http://localhost:8000' + res.data.imagem);
        }
      })
      .catch(err => {
        console.error('Erro ao carregar dados do utilizador:', err);
      });
  }, []);

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    if (image) {
      setImagem(image);
      setPreviewUrl(URL.createObjectURL(image));
    } else {
      setImagem(null);
      setPreviewUrl('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nome', nome);
    if (imagem) {
      formData.append('imagem', imagem);
    }

    try {
      await axios.put(PROFILE_URL, formData, {
        headers: {
          'X-CSRFToken': getCSRFToken(),
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil.');
    }
  };

  return (
    <div className="perfil-container">
      <h1>Meu Perfil</h1>

      <label>Nome</label>
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <label>Imagem de Perfil</label>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {previewUrl && <img src={previewUrl} alt="Preview" className="perfil-image" />}
      <br></br>
      <button onClick={handleUpload}>Guardar Alterações</button>
      <button onClick={() => navigate(-1)}>Voltar</button>
    </div>
  );
};

export default Perfil;
