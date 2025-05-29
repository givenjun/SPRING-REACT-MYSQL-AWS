package com.capstone.board_back.dto.response.board;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.capstone.board_back.common.ResponseCode;
import com.capstone.board_back.common.ResponseMessage;
import com.capstone.board_back.dto.object.CommentFavoriteListItem;
import com.capstone.board_back.dto.response.ResponseDto;
import com.capstone.board_back.repository.resultSet.GetCommentFavoriteListResultSet;

import lombok.Getter;

@Getter
public class GetCommentFavoriteListResponseDto extends ResponseDto {

    private List<CommentFavoriteListItem> commentFavoriteList;

    private GetCommentFavoriteListResponseDto(List<GetCommentFavoriteListResultSet> resultSets) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.commentFavoriteList = CommentFavoriteListItem.copyList(resultSets);
    }
    
    public static ResponseEntity<GetCommentFavoriteListResponseDto> success(List<GetCommentFavoriteListResultSet> resultSets) {
        GetCommentFavoriteListResponseDto result = new GetCommentFavoriteListResponseDto(resultSets);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> noExistComment() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_COMMENT, ResponseMessage.NOT_EXISTED_COMMENT);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
    
}