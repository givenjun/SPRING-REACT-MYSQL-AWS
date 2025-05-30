package com.capstone.board_back.service;

import com.capstone.board_back.webSocket.dto.ChatMessage;
import com.capstone.board_back.entity.ChatMessageEntity;
import com.capstone.board_back.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;

    public void saveMessage(ChatMessage chatMessage) {
        ChatMessageEntity entity = ChatMessageEntity.builder()
                .sender(chatMessage.getSender())
                .content(chatMessage.getContent())
                .timestamp(chatMessage.getTimestamp())
                .build();
        chatMessageRepository.save(entity);
    }

    public List<ChatMessage> getChatHistory() {
        return chatMessageRepository.findAll().stream()
                .map(entity -> new ChatMessage(
                        entity.getSender(),
                        entity.getSenderNickname(),
                        entity.getContent(),
                        entity.getTimestamp()
                ))
                .collect(Collectors.toList());
    }
}
