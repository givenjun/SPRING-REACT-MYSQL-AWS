// 📁 src/utils/websocket.ts
import SockJS from 'sockjs-client'
import { Client, IMessage } from '@stomp/stompjs'

export function createWebSocketClient(
  onMessageReceived: (msg: any) => void,
  onActiveUsersReceived: (list: string[]) => void,
  nickname: string
) {
  const client = new Client({
    webSocketFactory: () => new SockJS('http://localhost:4000/ws'),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('[🔌 STOMP CONNECTED]')

      // 1) 채팅 메시지 구독
      client.subscribe('/topic/public', (message: IMessage) => {
        const chat = JSON.parse(message.body)
        onMessageReceived(chat)
      })

      // 2) 활성 유저 목록 구독
      client.subscribe('/topic/activeUsers', (message: IMessage) => {
        const list: string[] = JSON.parse(message.body)
        onActiveUsersReceived(list)
      })

      // 3) 접속 알리기
      client.publish({
        destination: '/app/chat.addUser',
        headers: { nickname },
        body: JSON.stringify({ senderNickname: nickname }),
      })
    },
    onDisconnect: () => console.log('[🔌 STOMP DISCONNECTED]'),
    onStompError: frame => console.error('[❌ STOMP ERROR]', frame),
    debug: str => console.log('[STOMP DEBUG]', str),
  })

  client.activate()
  return client
}
