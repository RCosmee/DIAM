import { useState, useEffect } from "react";
import axios from 'axios';

const MessageList = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const ENDPOINT_URL = `http://127.0.0.1:8000/api/messages/${chatId}/`;

  useEffect(() => {
    axios.get(ENDPOINT_URL)
      .then(response => setMessages(response.data))
      .catch(err => console.error(err));
  }, [chatId]);

  return (
    <div className="container">
      <h2>Mensagens do Chat {chatId}</h2>
      {messages.map(msg => (
        <div key={msg.pk}>
          <strong>{msg.sender}:</strong> {msg.content}
          <p><em>{new Date(msg.timestamp).toLocaleString()}</em></p>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
