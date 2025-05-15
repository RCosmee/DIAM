import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Perfil.css';
import Sidebar from './Sidebar';
import Header from './Header';

const Perfil = () => {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [imagem, setImagem] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [removerImagem, setRemoverImagem] = useState(false);
  const navigate = useNavigate();


  const USER_URL = 'http://localhost:8000/api/user/';
  const PROFILE_URL = 'http://localhost:8000/api/profile/';

  const getCSRFToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
  };

  useEffect(() => {
    axios.get(USER_URL, { withCredentials: true })
      .then(res => {
        setNome(res.data.nome);
        setTipo(res.data.tipo_conta);
        if (res.data.imagem) {
          setPreviewUrl('http://localhost:8000' + res.data.imagem);
        } else {
          setPreviewUrl('http://localhost:8000/media/imagens_perfil/default.png');
        }
      })
      .catch(err => {
        console.error('Erro ao carregar dados do utilizador:', err);
        setPreviewUrl('http://localhost:8000/media/imagens_perfil/default.png');
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

  
const handleRemoveImage = () => {
  setRemoverImagem(true);
  setImagem(null);
  setPreviewUrl('http://localhost:8000/media/imagens_perfil/default.png');
};

const handleUpload = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('nome', nome);

  if (removerImagem) {
    formData.append('remove_image', 'true');  // Indica que a imagem deve ser removida
  } else if (imagem) {
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
    setRemoverImagem(false);  // Resetar a flag após salvar
    navigate(0);
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    alert('Erro ao atualizar perfil.');
  }
};
  return (
    <>
      <Header />
      <Sidebar />
      <div className="perfil-container">
        <h1>Meu Perfil</h1>

        <label>Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <label>Tipo de Utilizador</label>
        <input type="text" value={tipo} disabled />

        <label>Imagem de Perfil Atual</label>
        <div className="imagem-container">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Imagem de Perfil"
              className="perfil-image"
            />
          ) : (
            <img
              src="http://localhost:8000/media/imagens_perfil/default.png"
              alt="Imagem Padrão"
              className="perfil-image"
            />
          )}
        </div>

        <label>Alterar Imagem de Perfil</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <div className="perfil-buttons">
          <button onClick={handleUpload}>Guardar Alterações</button>
          <button type="button" onClick={handleRemoveImage}>Remover Imagem</button>
          <button onClick={() => navigate(-1)}>Voltar</button>
        </div>
      </div>
    </>
  );
};

export default Perfil;
