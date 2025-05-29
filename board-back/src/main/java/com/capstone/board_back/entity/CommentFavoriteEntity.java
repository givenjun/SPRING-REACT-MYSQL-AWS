package com.capstone.board_back.entity;

import com.capstone.board_back.entity.primaryKey.CommentFavoritePk;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="comment_favorite")
@Table(name="comment_favorite")
@IdClass(CommentFavoritePk.class)
public class CommentFavoriteEntity {
    
    @Id
    private String userEmail;
    @Id
    private int commentNumber;

}