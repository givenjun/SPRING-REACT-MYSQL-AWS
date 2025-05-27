package com.capstone.board_back.dto.object;

import com.capstone.board_back.repository.resultSet.GetCommnetListResultSet;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentListItem {

    private String nickname;
    private String profileImage;
    private String writeDatetime;
    private String content;

    public CommentListItem(GetCommnetListResultSet resultSet) {
        this.nickname = resultSet.getNickname();
        this.profileImage = resultSet.getProfileImage();
        this.writeDatetime = resultSet.getWriteDatetime();
        this.content = resultSet.getContent();
    }

    public static List<CommentListItem> copyList(List<GetCommnetListResultSet> resultSets) {
        List<CommentListItem> list = new ArrayList<>();
        for (GetCommnetListResultSet resultSet : resultSets) {
            CommentListItem correspondingItem = new CommentListItem(resultSet);
            list.add(correspondingItem);
        }
        return list;
    }

}
