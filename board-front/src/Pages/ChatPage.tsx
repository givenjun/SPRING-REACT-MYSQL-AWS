// 📁 ChatPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { createWebSocketClient } from '../utils/websocket';
import useLoginUserStore from 'stores/login-user.store';

interface ChatMessage {
  sender: string;
  senderNickname?: string;
  content: string;
  timestamp?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState('');
  const { loginUser } = useLoginUserStore();
  const clientRef = useRef<ReturnType<typeof createWebSocketClient> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 타임스탬프 기준으로 오름차순 정렬하는 헬퍼
  const sortByTimeAsc = (arr: ChatMessage[]) =>
    [...arr].sort((a, b) => {
      const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return ta - tb;
    });

  useEffect(() => {
    // 1) 기존 메시지 불러온 뒤 시간순 정렬
    fetch('http://localhost:4000/api/v1/chat/messages')
      .then(res => res.json())
      .then((data: ChatMessage[]) => {
        const sorted = sortByTimeAsc(data);
        setMessages(sorted);
      });

    // 2) STOMP 클라이언트 생성 및 구독
    clientRef.current = createWebSocketClient((msg: ChatMessage) => {
      // 새 메시지 추가 후에도 항상 시간순으로 정렬
      setMessages(prev => sortByTimeAsc([...prev, msg]));
    });

    // 언마운트 시 연결 해제
    return () => {
      clientRef.current?.deactivate();
      clientRef.current = null;
    };
  }, []);

  // 메시지 변경될 때마다 스크롤 맨 아래로
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!content.trim()) return;
    const email = loginUser?.email || 'anonymous@example.com';
    const nickname = loginUser?.nickname || '익명';

    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({ sender: email, senderNickname: nickname, content }),
      });
      setContent('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>공용 채팅방</h2>
      <div style={{
        border: '1px solid #ccc',
        padding: '10px',
        height: '300px',
        overflowY: 'scroll',
        marginBottom: '10px',
      }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>
              [{msg.timestamp
                ? new Date(msg.timestamp).toLocaleTimeString()
                : '시간없음'}]
              {msg.senderNickname || msg.sender}
            </strong>: {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <input
        type="text"
        placeholder="메시지 입력"
        value={content}
        onChange={e => setContent(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        style={{ marginRight: '8px', width: '300px' }}
      />
      <button onClick={handleSend}>보내기</button>
    </div>
  );
}
