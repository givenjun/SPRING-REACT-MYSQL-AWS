// 📁 src/main/java/com/capstone/board_back/controller/ChatController.java
package com.capstone.board_back.controller;

import com.capstone.board_back.webSocket.dto.ChatMessage;
import com.capstone.board_back.entity.ChatMessageEntity;
import com.capstone.board_back.repository.ChatMessageRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Controller
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // 접속 중인 닉네임을 저장할 스레드 안전한 Set
    private final Set<String> activeUsers = ConcurrentHashMap.newKeySet();

    // 1) 클라이언트가 입장할 때 호출
    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessage message,
                        SimpMessageHeaderAccessor headerAccessor) {
        String nick = message.getSenderNickname();
        // 세션에 닉네임 저장
        headerAccessor.getSessionAttributes().put("nickname", nick);
        // activeUsers에 추가
        activeUsers.add(nick);
        // /topic/activeUsers로 접속자 리스트 전송
        messagingTemplate.convertAndSend("/topic/activeUsers", activeUsers);
    }

    // 2) 채팅 메시지 처리 (기존 로직 그대로)
    @MessageMapping("/chat.sendMessage")
    public ChatMessage sendMessage(@Payload ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());
        chatMessageRepository.save(new ChatMessageEntity(
            null,
            message.getSender(),
            message.getSenderNickname(),
            message.getContent(),
            message.getTimestamp()
        ));
        // public 브로커로 메시지 전송
        messagingTemplate.convertAndSend("/topic/public", message);
        return message;
    }

    // 3) 클라이언트가 나갈 때 호출
    @EventListener
    public void handleDisconnectListener(SessionDisconnectEvent event) {
        SimpMessageHeaderAccessor sha = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String nick = (String) sha.getSessionAttributes().get("nickname");
        if (nick != null) {
            activeUsers.remove(nick);
            messagingTemplate.convertAndSend("/topic/activeUsers", activeUsers);
        }
    }
}
