import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import './Mensagens.css';

export default function Mensagens() {
  const [chats, setChats] = useState([]);             
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);       
  const [newMessage, setNewMessage] = useState("");   
  const [searchTerm, setSearchTerm] = useState("");   
  const [userEmail, setUserEmail] = useState("");     // estado para email do user

  const BASE_URL = 'http://127.0.0.1:8000/api';

  // Buscar dados do user atual (email)
  useEffect(() => {
    axios.get(`${BASE_URL}/user/me/`)  // ajusta para o endpoint real que retorna o user atual
      .then(response => {
        setUserEmail(response.data.email);
      })
      .catch(err => console.error("Erro ao carregar usuário atual:", err));
  }, []);

  // Buscar todos os chats ao carregar a página
  useEffect(() => {
    axios.get(`${BASE_URL}/chats/`)
      .then(response => {
        setChats(response.data);
        if (response.data.length > 0) {
          setSelectedChat(response.data[0]);
        }
      })
      .catch(err => console.error("Erro ao carregar chats:", err));
  }, []);

  // Buscar mensagens do chat selecionado sempre que mudar o chat
  useEffect(() => {
    if (selectedChat) {
      axios.get(`${BASE_URL}/messages/${selectedChat.pk}/`)
        .then(response => {
          setMessages(response.data);
        })
        .catch(err => console.error("Erro ao carregar mensagens:", err));
    }
  }, [selectedChat]);

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !userEmail) return;

    axios.post(`${BASE_URL}/messages/${selectedChat.pk}/`, {
      sender: userEmail,    // usa o email do user atual
      content: newMessage,
      chat: selectedChat.pk
    })
    .then(response => {
      setMessages(prev => [...prev, response.data]);
      setNewMessage("");
    })
    .catch(err => console.error("Erro ao enviar mensagem:", err));
  };

  return (
    <>
      <Header />
      <Sidebar />

      <div className="chat-container">
        <div className="contacts-list">
          <div className="contacts-header">
            <h4>Conversas</h4>
          </div>
          <div className="contacts-search">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="contacts-list-items">
            {filteredChats.map((chat) => (
              <li
                key={chat.pk}
                className={`contact-item ${selectedChat && selectedChat.pk === chat.pk ? 'active' : ''}`}
                onClick={() => setSelectedChat(chat)}
              >
                <img src={chat.avatar} alt={chat.name} className="contact-avatar" />
                <div className="contact-info">
                  <span className="contact-name">{chat.name}</span>
                  <span className="contact-status">
                    <i className={`fa fa-circle ${chat.status}`}></i> {chat.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {selectedChat && (
          <div className="chat-area">
            <div className="chat-header">
              <img src={selectedChat.avatar} alt={selectedChat.name} className="chat-header-avatar" />
              <div className="chat-header-info">
                <h5 className="chat-header-name">{selectedChat.name}</h5>
                <span className="chat-header-status">Status: {selectedChat.status}</span>
              </div>
            </div>

            <div className="chat-history">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-message ${msg.sender === userEmail ? "sent" : "received"}`}
                >
                  <div className="chat-message-meta">
                    {msg.sender !== userEmail && (
                      <img
                        src={selectedChat.avatar}
                        alt={msg.sender}
                        className="message-avatar"
                      />
                    )}
                    <div className="message-info">
                      <div className="message-header">
                        <span className="message-sender">{msg.sender}</span>
                        <span className="message-time">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="chat-message-content">{msg.content}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
              />
              <button onClick={handleSendMessage}><i className="fa fa-paper-plane"></i></button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
