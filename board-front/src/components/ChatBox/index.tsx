import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import './style.css';

interface ChatMessage {
  sender: string;
  content: string;
}

const ChatBox = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [stompClient, setStompClient] = useState<Client | null>(null);

  useEffect(() => {
  const socket = new SockJS('http://localhost:8080/ws');
  const client = new Client({
    webSocketFactory: () => socket,
    onConnect: () => {
      client.subscribe('/topic/public', (message: IMessage) => {
        const chat: ChatMessage = JSON.parse(message.body);
        setMessages(prev => [...prev, chat]);
      });
    },
  });

  client.activate();
  setStompClient(client);

  // ⛔ 잘못된 방식: return async () => await client.deactivate(); ❌

  return () => {
    client.deactivate(); // ✅ 그냥 이렇게 호출하면 됨 (Promise 무시)
  };
}, []);

  const sendMessage = () => {
    if (!stompClient || !input.trim()) return;
    const chat: ChatMessage = { sender: '익명', content: input };
    stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(chat),
    });
    setInput('');
  };

  return (
    <div className="chatbox">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i}><strong>{msg.sender}</strong>: {msg.content}</div>
        ))}
      </div>
      <div className="chat-input-box">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatBox;
