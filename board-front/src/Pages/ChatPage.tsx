import React, { useState, useEffect, useRef } from 'react'
import { createWebSocketClient } from '../utils/websocket'
import useLoginUserStore from 'stores/login-user.store'
import { toast } from 'react-toastify'
import './style.css'

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [activeUsers, setActiveUsers] = useState<string[]>([])
  const [content, setContent] = useState('')
  const { loginUser } = useLoginUserStore()
  const clientRef = useRef<any>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loginUser?.nickname) return

    const nickname = loginUser.nickname

    fetch('http://localhost:4000/api/v1/chat/messages')
      .then(r => r.json())
      .then((data: any[]) =>
        setMessages(data.sort((a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ))
      )

    clientRef.current = createWebSocketClient(
      msg => setMessages(prev => [...prev, msg]),
      list => setActiveUsers(list),
      nickname
    )

    return () => {
      clientRef.current?.deactivate()
      clientRef.current = null
    }
  }, [loginUser])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!content.trim()) return
    if (content.length > 255) {
      toast.warn('메시지는 255자 이하로 입력해주세요.')
      return
    }

    const email = loginUser?.email || 'anonymous@example.com'
    const nickname = loginUser!.nickname
    clientRef.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({ sender: email, senderNickname: nickname, content }),
    })
    setContent('')
  }

  return (
    <div className='chat-page-wrapper'>
      <div className="board-bottom-popular-card">
        <div className="chat-wrapper">
          <div className="chat-left">
            <h2>공용 채팅방</h2>
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className="chat-message-line">
                  <strong>
                    [{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : '시간없음'}]
                    {msg.senderNickname}
                  </strong>
                  : {msg.content}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="chat-input-box">
              <div className="chat-input-info">
                {content.length} / 255자
              </div>
              <div className="chat-input-row">
                <input
                  placeholder="메시지 입력"
                  value={content}
                  onChange={e => {
                    const value = e.target.value
                    if (value.length > 255) {
                      toast.warn('메시지는 255자 이하로 입력해주세요.')
                      return
                    }
                    setContent(value)
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  maxLength={255}
                />
                <button onClick={handleSend}>보내기</button>
              </div>
            </div>
          </div>
          <div className="chat-right">
            <div className="active-header">
              <span className="status-dot" />현재 접속중인 인원 : {activeUsers.length}명
            </div>
            <ul className="active-list">
              {activeUsers.map(user => (
                <li key={user}>{user.replace(/^[^\uAC00-\uD7A3\w]+/, '')}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
