// 📁 utils/websocket.ts
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

// 메시지 수신 콜백을 받아 STOMP Client 인스턴스 생성·반환
export function createWebSocketClient(onMessageReceived: (msg: any) => void) {
  const client = new Client({
    webSocketFactory: () => new SockJS('http://localhost:4000/ws'),
    reconnectDelay: 5000, // 연결 끊기면 5초 뒤 자동 재시도
    onConnect: () => {
      console.log('[🔌 CONNECTED]');
      client.subscribe('/topic/public', (message: IMessage) => {
        console.log('[📩 RAW MESSAGE]', message);
        try {
          const msg = JSON.parse(message.body);
          console.log('[📥 RECEIVED]', msg);
          onMessageReceived(msg);
        } catch (err) {
          console.error('[❌ PARSE ERROR]', err);
        }
      });
    },
    onDisconnect: () => {
      console.log('[🔌 DISCONNECTED]');
    },
    onStompError: (frame) => {
      console.error('[❌ STOMP ERROR]', frame);
    },
    debug: (str) => console.log('[STOMP DEBUG]', str),
  });

  client.activate();
  return client;
}
