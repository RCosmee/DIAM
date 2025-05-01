import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Mensagens.css';

const groups = [
  { name: 'PT Faker', avatar: "/imagens/faker.jpeg", status: 'online' },
  { name: 'Nutricionista Joana', avatar: "/imagens/kanyewest.png", status: 'offline' },
  { name: 'Pilates', avatar: "/imagens/jbieber.jpeg", status: 'online' },
  { name: 'Natação', avatar: "/imagens/acdc.jpeg", status: 'offline' },
];

const initialMessages = [
  { group: 'PT Faker', sender: 'PT Faker', content: 'Muito bem-vindo!' },
  { group: 'PT Faker', sender: 'Você', content: 'Obrigado!' },
  { group: 'Nutricionista Joana', sender: 'Nutricionista', content: 'Olá a todos!' },
  { group: 'Nutricionista Joana', sender: 'Você', content: 'Tudo bem?' }
];

export default function Mensagens() {
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      { group: selectedGroup.name, sender: "Você", content: newMessage }
    ]);
    setNewMessage("");
  };

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="chat-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h4>Conversas</h4>
          </div>
          <div className="sidebar-search">
            <input type="text" placeholder="Pesquisar..." />
          </div>
          <ul className="sidebar-list">
            {groups.map((group, idx) => (
              <li
                key={idx}
                className={`sidebar-item ${selectedGroup.name === group.name ? 'active' : ''}`}
                onClick={() => setSelectedGroup(group)}
              >
                <img src={group.avatar} alt={group.name} className="sidebar-avatar" />
                <div className="sidebar-info">
                  <span className="sidebar-name">{group.name}</span>
                  <span className="sidebar-status">
                    <i className={`fa fa-circle ${group.status}`}></i> {group.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          <div className="chat-header">
            <img src={selectedGroup.avatar} alt={selectedGroup.name} className="chat-header-avatar" />
            <div className="chat-header-info">
              <h5 className="chat-header-name">{selectedGroup.name}</h5>
              <span className="chat-header-status">Status: {selectedGroup.status}</span>
            </div>
          </div>

          <div className="chat-history">
            {messages
              .filter(msg => msg.group === selectedGroup.name)
              .map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.sender === "Você" ? "sent" : "received"}`}>
                  <div className="chat-message-content">{msg.content}</div>
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
      </div>
    </div>
  );
}