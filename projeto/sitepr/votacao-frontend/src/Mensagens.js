import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import './Mensagens.css';

export default function Mensagens() {
  const [userId, setUserId] = useState(null);
  const [chats, setChats] = useState([]);
  const [nonchats, setNonChats] = useState([]);
  const [nonchats2, setNonChats2] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");
  const [headerAvatarSrc, setHeaderAvatarSrc] = useState("");
  const [headerAvatarAlt, setHeaderAvatarAlt] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);
  const BASE_URL = 'http://127.0.0.1:8000/api';

  const getUserById = (id) => {
    return allUsers.find(user => user.id === id);
  };

  useEffect(() => {
    axios.get(`http://localhost:8000/api/user/`, { withCredentials: true })
      .then(res => {
        setUserId(res.data.id);
      })
      .catch(err => console.error("Erro ao obter ID do usuário:", err));
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/users/`)
      .then(response => {
        setAllUsers(response.data);
      })
      .catch(error => {
        console.error("Erro ao carregar usuários:", error);
      });
  }, []);

  useEffect(() => {
    if (userId !== null) {
          handleChats();
    }
  }, [userId]);


  useEffect(() => {
    if (selectedChat) {
      axios.get(`${BASE_URL}/messages/${selectedChat.pk}/`)
        .then(response => {
          setMessages(response.data);
        })
        .catch(err => console.error("Erro ao carregar mensagens:", err));

    }
  }, [selectedChat]);

  useEffect(() => {
    if (!selectedChat || !userId || allUsers.length === 0) return;

    let src = '';
    let alt = selectedChat.name || 'Usuário';

    if (selectedChat.avatar) {
      src = `http://localhost:8000/media/imagens_perfil/${selectedChat.avatar}.png`;
    } else {
      const otherParticipantId = selectedChat.participants.find(id => id !== userId);
      const otherUser = allUsers.find(user => user.id === otherParticipantId);

      if (otherUser && otherUser.imagem) {
        src = `http://localhost:8000${otherUser.imagem}`;
        alt = otherUser.nome || 'Usuário';
      } else {
        src = 'http://localhost:8000/media/imagens_perfil/default.png';
        alt = 'Usuário padrão';
      }
    }
    setHeaderAvatarSrc(src);
    setHeaderAvatarAlt(alt);

  }, [selectedChat, userId, allUsers]);


  const filteredChats = chats
    .filter(chat => chat.name.toLowerCase().includes(searchTerm.toLowerCase())); 

  const filteredChats2 = nonchats
    .filter(chat => chat.name.toLowerCase().includes(searchTerm2.toLowerCase()));
  const filteredChats3 = nonchats2
  .filter(user => user.nome.toLowerCase().includes(searchTerm2.toLowerCase()));

  const handleChats = () => {
    if (userId !== null) {
      axios.get(`${BASE_URL}/chats/`)
        .then(response => {
          const nuserChats = response.data.filter(chat =>
            !chat.participants.includes(userId) && chat.avatar!=="" && chat.avatar!==null);
          setNonChats(nuserChats);

          const userChats = response.data.filter(chat =>
            chat.participants.includes(userId)
          );
          setChats(userChats);
          if (userChats.length > 0) {
            setSelectedChat(userChats[0]);
          }
        })
        .catch(err => console.error("Erro ao carregar chats:", err));
    }
  };
  const handleUsersWithoutChat = () => {
    const usersWithPrivateChat = new Set();

    chats.forEach(chat => {
      const isPrivate = (!chat.avatar || chat.avatar === "") && chat.participants.length === 2;

      if (isPrivate) {
        const participantIds = chat.participants.map(p => p.id ?? p);

        if (participantIds.includes(userId)) {
          participantIds.forEach(id => {
            if (id !== userId) {
              usersWithPrivateChat.add(id);
            }
          });
        }
      }
    });
    const usersWithoutPrivateChat = allUsers.filter(
      user => !usersWithPrivateChat.has(user.id) && user.id !== userId && user.id !== 5
    );

    setNonChats2(usersWithoutPrivateChat);
  };



  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || userId === null) return;

    axios.post(`${BASE_URL}/messages/${selectedChat.pk}/`, {
      sender: userId,
      content: newMessage,
      chat: selectedChat.pk
    })
      .then(response => {
        setMessages(prev => [...prev, response.data]);
        setNewMessage("");
      })
      .catch(err => console.error("Erro ao enviar mensagem:", err));
  };


  
  const handleLeaveChat = () => {
    if (!selectedChat || userId === null) return;

    axios.delete(`${BASE_URL}/chats/${selectedChat.pk}/remove_participant/`, {
      params: { user_id: userId }
    })
      .then(response => {
        console.log("Usuário removido do chat:", response.data);

        setChats(prevChats => prevChats.filter(chat => chat.pk !== selectedChat.pk));
        setSelectedChat(null);
        setMessages([]);
        handleChats();
      })
      .catch(error => {
        console.error("Erro ao sair do chat:", error);
      });
  };
  
  const handleJoinChats = async (chatIds) => {
    if (!chatIds.length || userId === null) return;
    try {
      await Promise.all(
        chatIds.map(chatId =>
          axios.post(`${BASE_URL}/chats/${chatId}/add_participant/`,
            null,
            { params: { user_id: userId } }
          )
        )
      );

      const added = nonchats.filter(c => chatIds.includes(c.pk));

      setChats(prev => [...prev, ...added]);
      setNonChats(prev => prev.filter(c => !chatIds.includes(c.pk)));
      setSelectedChats([]);
    } catch (err) {
      console.error("Erro ao adicionar grupos:", err);
    }
  };

  const handleJoinChats2 = async (usersList) => {
    if (!usersList.length) return;

    try {
      await Promise.all(
        usersList.map(userIdToAdd =>
          axios.post(`${BASE_URL}/chats/create_chat_without_name_avatar/`, {
            participants: [userId, userIdToAdd] 
          })
        )
      );

      handleChats();
      setNonChats2(prev => prev.filter(user => !usersList.includes(user.id)));

      setSelectedChats([]);
    } catch (err) {
      console.error("Erro ao criar chats:", err);
    }
  };

  const handleAdicionarGrupos = () => {
    setShowModal(true);
  };

  const handleAdicionarChats = () => {
    handleUsersWithoutChat();
    setShowModal2(true);
  };

    const handleCloseModal2 = () => {
    setShowModal2(false);
    setSelectedChats([]);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedChats([]);
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
                <img
                  src={`http://localhost:8000/media/imagens_perfil/${chat.avatar}.png`}
                  alt={chat.name}
                  className="contact-avatar"
                  onError={(e) => {
                    const otherParticipantId = chat.participants.find(id => id !== userId);
                    if (otherParticipantId) {
                      const otherUser = allUsers.find(user => user.id === otherParticipantId);
                      if (otherUser && otherUser.imagem) {
                        e.currentTarget.src = `http://localhost:8000${otherUser.imagem}`;
                        e.currentTarget.alt = otherUser.nome || "Usuário";
                        return;
                      }
                    }
                    e.currentTarget.src = 'http://localhost:8000/media/imagens_perfil/default.png';
                  }}
                />

                <div className="contact-info">
                  <span className="contact-name">
                    {(() => {
                      const otherParticipantId = chat.participants.find(id => id !== userId);
                      if (chat.name && chat.name !== "") return chat.name;
                      const otherUser = allUsers.find(user => user.id === otherParticipantId);
                      return otherUser?.nome || "Usuário";
                    })()}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <button
            className="btn-adicionar-grupos"
            onClick={handleAdicionarChats}
          >
            Adicionar Conversas
          </button>

          <button
            className="btn-adicionar-grupos"
            onClick={handleAdicionarGrupos}
          >
            Adicionar Grupos
          </button>
        </div>

        {selectedChat && (
          <div className="chat-area">
            <div className="chat-header">
              <div className="chat-header-left">
                <img
                  src={headerAvatarSrc}
                  alt={headerAvatarAlt}
                  className="chat-header-avatar"
                  onError={(e) => {
                    e.currentTarget.src = 'http://localhost:8000/media/imagens_perfil/default.png';
                    e.currentTarget.alt = 'Usuário padrão';
                  }}
                />
                <div className="chat-header-info">
                  <h5 className="chat-header-name">
                    {(() => {
                      const otherParticipantId = selectedChat.participants.find(id => id !== userId);
                      if (selectedChat.name && selectedChat.name !== "") return selectedChat.name;
                      const otherUser = allUsers.find(user => user.id === otherParticipantId);
                      return otherUser?.nome || "Usuário";
                    })()}
                  </h5>
                </div>
              </div>


              {selectedChat?.avatar &&
              selectedChat.avatar !== "" &&
              selectedChat.avatar !== null && (
                <div className="tooltip-wrapper">
                  <button className="chat-header-button" onClick={handleLeaveChat}>
                    <i className="fas fa-right-from-bracket"></i>
                  </button>
                  <span className="tooltip-text">Sair do chat</span>
                </div>
              )}
            </div>

            <div className="chat-history">
              {messages.map((msg, idx) => {
                const isOwnMessage = msg.sender === userId;
                const senderData = getUserById(msg.sender);
                const avatarSrc = isOwnMessage
                  ? (getUserById(userId)?.imagem
                    ? `http://localhost:8000${getUserById(userId).imagem}`
                    : "http://localhost:8000/media/imagens_perfil/default.png")
                  : (senderData?.imagem
                    ? `http://localhost:8000${senderData.imagem}`
                    : "http://localhost:8000/media/imagens_perfil/default.png");

                return (
                  <div key={idx} className={`chat-message ${isOwnMessage ? "sent" : "received"}`}>
                    <div className="chat-message-meta">
                      <img
                        src={avatarSrc}
                        alt={senderData?.nome || "Desconhecido"}
                        className="message-avatar"
                      />
                      <div className="message-info">
                        <div className="message-header">
                          <span className="message-sender">
                            {isOwnMessage ? "Eu" : senderData?.nome || "Desconhecido"}
                          </span>
                          <span className="message-time">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="chat-message-content">{msg.content}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
              />
              <button onClick={handleSendMessage}><i className="far fa-paper-plane"></i></button>
            </div>
          </div>
        )}
      </div>

      {showModal2 && (
        <div className="modal-overlay" onClick={handleCloseModal2}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Adicionar Conversas</h2>
            <p>Escolha as pessoas com quem deseja conversar</p>
            <div className="contacts-search">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm2}
                onChange={(e) => setSearchTerm2(e.target.value)}
              />
            </div>

        <ul className="contacts-list-items2">
          {filteredChats3.map((user) => {
            const displayName = user?.nome || "Usuário";
            const avatarSrc = user?.imagem
              ? `http://localhost:8000${user.imagem}`
              : "http://localhost:8000/media/imagens_perfil/default.png";

                const isChecked = selectedChats.includes(user.id);

                const toggleCheckbox = () => {
                  setSelectedChats((prev) =>
                    prev.includes(user.id)
                      ? prev.filter((id) => id !== user.id)
                      : [...prev, user.id]
                  );
                };

                return (
                  <li key={user.id} className="addg-contact-item" onClick={toggleCheckbox}>
                    <div className="checkbox-container">
                      <div className="checkbox-info">
                        <img
                          src={avatarSrc}
                          alt={displayName}
                          className="contact-avatar"
                          onError={(e) => {
                            e.currentTarget.src = 'http://localhost:8000/media/imagens_perfil/default.png';
                          }}
                        />
                        <div className="contact-info">
                          <span className="contact-name">{displayName}</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        onClick={(e) => e.stopPropagation()}
                        className="checkbox-right"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            <button className="btn-adicionar-grupos" onClick={() => handleJoinChats2(selectedChats)}>Adicionar Conversas</button>
            <button className="btn-fechar-adicionar-grupos" onClick={handleCloseModal2}>Fechar</button>
          </div>
        </div>
      )}



      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Adicionar Grupos</h2>
            <p>Clicke nos grupos que deseja participar</p>
            <div className="contacts-search">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm2}
                onChange={(e) => setSearchTerm2(e.target.value)}
              />
            </div>

            <ul className="contacts-list-items2">
              {filteredChats2.map((chat) => {
                const otherParticipantId = chat.participants.find(id => id !== userId);
                const otherUser = allUsers.find(user => user.id === otherParticipantId);
                const displayName = chat.name || otherUser?.nome || "Usuário";
                const avatarSrc = chat.avatar
                  ? `http://localhost:8000/media/imagens_perfil/${chat.avatar}.png`
                  : (otherUser?.imagem ? `http://localhost:8000${otherUser.imagem}` : 'http://localhost:8000/media/imagens_perfil/default.png');

                const isChecked = selectedChats.includes(chat.pk);

                const toggleCheckbox = () => {
                  setSelectedChats((prev) =>
                    prev.includes(chat.pk)
                      ? prev.filter((id) => id !== chat.pk)
                      : [...prev, chat.pk]
                  );
                };

                return (
                  <li key={chat.pk} className="addg-contact-item" onClick={toggleCheckbox}>
                    <div className="checkbox-container">
                      <div className="checkbox-info">
                        <img
                          src={avatarSrc}
                          alt={displayName}
                          className="contact-avatar"
                          onError={(e) => {
                            e.currentTarget.src = 'http://localhost:8000/media/imagens_perfil/default.png';
                          }}
                        />
                        <div className="contact-info">
                          <span className="contact-name">{displayName}</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // bloqueia atualização dupla
                        onClick={(e) => e.stopPropagation()} // previne o clique de ir para o pai
                        className="checkbox-right"
                      />
                    </div>
                  </li>


                );
              })}
            </ul>
            <button className="btn-adicionar-grupos" onClick={() => handleJoinChats(selectedChats)}>Adicionar Grupos</button>
            <button className="btn-fechar-adicionar-grupos" onClick={handleCloseModal}>Fechar</button>
          </div>
        </div>
      )}
    </>
  );
}