import { useState, useEffect } from "react";
import axios from 'axios';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const ENDPOINT_URL = 'http://127.0.0.1:8000/api/chats/';

  useEffect(() => {
    axios.get(ENDPOINT_URL)
      .then(response => setChats(response.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h1>Lista de Chats</h1>
      {chats.map(chat => (
        <div key={chat.pk}>
          <h3>{chat.name}</h3>
          <p>Status: {chat.status}</p>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
