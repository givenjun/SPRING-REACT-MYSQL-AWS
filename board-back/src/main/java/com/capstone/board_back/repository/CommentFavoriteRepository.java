package com.capstone.board_back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.capstone.board_back.entity.CommentFavoriteEntity;
import com.capstone.board_back.entity.primaryKey.CommentFavoritePk;
import com.capstone.board_back.repository.resultSet.GetCommentFavoriteListResultSet;

import jakarta.transaction.Transactional;

@Repository
public interface CommentFavoriteRepository extends JpaRepository<CommentFavoriteEntity, CommentFavoritePk> {

    CommentFavoriteEntity findByCommentNumberAndUserEmail(Integer commentNumber, String userEmail);

    @Query(value = 
    "SELECT CF.user_email as userEmail " +
    "FROM comment AS C " +
    "INNER JOIN comment_favorite AS CF ON C.comment_number = CF.comment_number " +
    "WHERE C.comment_number = ?1",
    nativeQuery = true)
    List<GetCommentFavoriteListResultSet> getCommentFavoriteList(Integer commentNumber);

    @Transactional
    void deleteByCommentNumber(Integer CommentNumber);
}