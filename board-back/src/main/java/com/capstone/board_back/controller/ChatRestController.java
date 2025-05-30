// 📄 ChatRestController.java


package com.capstone.board_back.controller;

import com.capstone.board_back.entity.ChatMessageEntity;
import com.capstone.board_back.repository.ChatMessageRepository;
import com.capstone.board_back.webSocket.dto.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatRestController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @GetMapping("/messages")
    public List<ChatMessage> getRecentMessages() {
        return chatMessageRepository.findTop50ByOrderByTimestampDesc()
                .stream()
                .map(entity -> new ChatMessage(
                        entity.getSender(),
                        entity.getSenderNickname(),
                        entity.getContent(),
                        entity.getTimestamp()
                ))
                .collect(Collectors.toList());
    }
}
