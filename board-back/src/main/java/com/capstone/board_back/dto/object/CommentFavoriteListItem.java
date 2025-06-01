package com.capstone.board_back.dto.object;

import java.util.ArrayList;
import java.util.List;

import com.capstone.board_back.repository.resultSet.GetCommentFavoriteListResultSet;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentFavoriteListItem {
    private String email;

    public CommentFavoriteListItem(GetCommentFavoriteListResultSet resultSet) {
        this.email = resultSet.getUserEmail();
    }

    public static List<CommentFavoriteListItem> copyList(List<GetCommentFavoriteListResultSet> resultSets) {
        List<CommentFavoriteListItem> list = new ArrayList<>();
        for (GetCommentFavoriteListResultSet resultSet: resultSets) {
            CommentFavoriteListItem commentFavoriteListItem = new CommentFavoriteListItem(resultSet);
            list.add(commentFavoriteListItem);
        }
        return list;
    }
}