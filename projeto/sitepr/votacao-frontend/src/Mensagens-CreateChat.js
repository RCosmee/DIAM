import { useState } from "react";
import axios from "axios";
import "./simple_style.css";

function CreateChat() {
  // Alterar o endpoint para o da API de chats
  const ENDPOINT_URL = 'http://127.0.0.1:8000/api/chats/';
  
  const [name, setName] = useState(""); // Nome do chat
  const [avatar, setAvatar] = useState(""); // URL do avatar
  const [status, setStatus] = useState("offline"); // Status do chat (offline por padrão)
  
  const submitHandler = (e) => {
    e.preventDefault();
    
    // Criar o chat com os dados fornecidos
    axios
      .post(ENDPOINT_URL, {
        name: name,
        avatar: avatar,
        status: status,
      })
      .then((response) => {
        console.log("Chat criado com sucesso:", response.data);
        // Limpar campos após a criação do chat
        setName("");
        setAvatar("");
        setStatus("offline");
      })
      .catch((error) => {
        console.error("Erro ao criar chat:", error);
      });
  };

  return (
    <div className="container">
      <h1>Criar um novo Chat</h1>
      <form onSubmit={submitHandler}>
        <label>Nome do Chat: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        
        <label>Avatar (URL): </label>
        <input
          type="text"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
        <br />
        
        <label>Status: </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
        <br /><br />
        
        <input type="submit" value="Criar Chat" />
      </form>
    </div>
  );
}

export default CreateChat;
