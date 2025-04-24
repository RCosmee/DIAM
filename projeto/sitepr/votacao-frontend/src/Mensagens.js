import { useState } from 'react';
import Sidebar from './Sidebar';
<div>
<Sidebar />
</div>

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
       <div>
      <Sidebar />
      </div>
      <div className="conteudo" >
      <h1 className="text-4xl font-bold text-center mb-4">GYM</h1>
      <h2 className="text-xl text-center mb-6">Mensagens</h2>

      {!selectedGroup ? (
        <div >
          <input
            type="text"
            placeholder="🔍 Pesquisar"
            className="mb-4 w-full p-2 border rounded"
            />
          <ul className="space-y-2">
            {groups.map((group, index) => (
              <li
              key={index}
              onClick={() => setSelectedGroup(group)}
              className="cursor-pointer hover:bg-gray-100 p-2 border-b"
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
            className="mb-4 text-blue-500 hover:underline"
            >
            ← Voltar
          </button>
          <h2 className="text-2xl font-semibold mb-4">{selectedGroup}</h2>
          <div className="border rounded p-4 h-64 overflow-y-auto bg-gray-50">
            {messages
              .filter(msg => msg.group === selectedGroup)
              .map((msg, idx) => (
                <div key={idx} className="mb-2">
                  <strong>{msg.sender}:</strong> {msg.content}
                </div>
              ))}
          </div>
          <div className="mt-4 flex">
            <input
              type="text"
              placeholder="Escreva..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow p-2 border rounded-l"
              />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-r"
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

