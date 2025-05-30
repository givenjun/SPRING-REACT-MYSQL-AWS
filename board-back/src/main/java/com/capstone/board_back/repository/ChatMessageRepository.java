package com.capstone.board_back.repository;


import com.capstone.board_back.entity.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Integer> {
    List<ChatMessageEntity> findTop50ByOrderByTimestampDesc();
}
