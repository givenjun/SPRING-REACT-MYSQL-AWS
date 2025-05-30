package com.capstone.board_back.controller;

import com.capstone.board_back.webSocket.dto.ChatMessage;
import com.capstone.board_back.entity.ChatMessageEntity;
import com.capstone.board_back.repository.ChatMessageRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Controller
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage message) {
        System.out.println("✅ 메시지 도착: " + message.getSenderNickname() + " / " + message.getContent());

        message.setTimestamp(LocalDateTime.now());

        // DB 저장은 이메일만 사용하고, 닉네임은 안 넣어도 괜찮아
        ChatMessageEntity entity = new ChatMessageEntity(
            null,
            message.getSender(),            // 이메일
            message.getSenderNickname(),
            message.getContent(),
            message.getTimestamp()
        );
        chatMessageRepository.save(entity);

        return message; // 닉네임 포함된 메시지 다시 전송
    }

}
