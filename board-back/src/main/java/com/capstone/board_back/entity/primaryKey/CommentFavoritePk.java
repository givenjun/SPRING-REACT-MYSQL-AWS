package com.capstone.board_back.entity.primaryKey;

import java.io.Serializable;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentFavoritePk implements Serializable {

    @Column(name="user_email")
    private String userEmail;
    @Column(name="comment_number")
    private int commentNumber;

    
}