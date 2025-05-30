package com.capstone.board_back.webSocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class WebSocketEventListener {

    // 세션ID → 닉네임 매핑
    private final Set<String> activeUsers = ConcurrentHashMap.newKeySet();

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // 클라이언트가 /app/chat.addUser 로 접속을 알리면
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        String nickname = sha.getFirstNativeHeader("nickname");
        if (nickname != null) {
            activeUsers.add(nickname);
            broadcastActiveUsers();
            log.info("접속: {}, 현재 {}명", nickname, activeUsers.size());
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        String nickname = (String) sha.getSessionAttributes().get("nickname");
        if (nickname != null) {
            activeUsers.remove(nickname);
            broadcastActiveUsers();
            log.info("접속해제: {}, 현재 {}명", nickname, activeUsers.size());
        }
    }

    private void broadcastActiveUsers() {
        // /topic/activeUsers 로 접속자 리스트 전송
        messagingTemplate.convertAndSend("/topic/activeUsers", activeUsers);
    }
}
