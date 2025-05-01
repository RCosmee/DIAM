import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Mensagens.css';

const groups = [
  'PT Faker',
  'Nutricionista Joana',
  'Pilates',
  'Natação'
];

const initialMessages = [
  { group: 'PT Faker', sender: 'PT Faker', content: 'Muito bem vindo!' },
  { group: 'PT Faker', sender: 'Você', content: 'Obrigado!' },
  { group: 'PT Faker', sender: 'PT Faker', content: 'Tudo bem?' },
  { group: 'Nutricionista Joana', sender: 'Nutricionista', content: 'Olá a todos!' },
  { group: 'Nutricionista Joana', sender: 'Você', content: 'Tudo bem?' }
];

function Mensagens() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    const updatedMessages = [
      ...messages,
      { group: selectedGroup, sender: "Você", content: newMessage }
    ];
    setMessages(updatedMessages);
    setNewMessage("");
  };

  return (
    <div>
      <Header />
      <Sidebar />

      <div className="mensagens-container">
        <h2 className="titulo-mensagens">Mensagens</h2>

        {!selectedGroup ? (
          <div>
            <input
              type="text"
              placeholder="🔍 Pesquisar"
              className="pesquisa-input"
            />
            <ul className="lista-grupos">
              {groups.map((group, index) => (
                <li
                  key={index}
                  onClick={() => setSelectedGroup(group)}
                  className="item-grupo"
                >
                  {group}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedGroup(null)}
              className="voltar-btn"
            >
              ← Voltar
            </button>
            <h2 className="titulo-grupo">{selectedGroup}</h2>
            <div className="chat-box">
              {messages
                .filter(msg => msg.group === selectedGroup)
                .map((msg, idx) => (
                  <div key={idx} className="mensagem">
                    <strong>{msg.sender}:</strong> {msg.content}
                  </div>
                ))}
            </div>
            <div className="input-mensagem-container">
              <input
                type="text"
                placeholder="Escreva..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="input-mensagem"
              />
              <button
                onClick={handleSendMessage}
                className="enviar-btn"
              >
                ➤
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Mensagens;
