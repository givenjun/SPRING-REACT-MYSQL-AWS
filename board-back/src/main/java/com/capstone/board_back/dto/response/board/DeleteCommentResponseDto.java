package com.capstone.board_back.dto.response.board;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.capstone.board_back.common.ResponseCode;
import com.capstone.board_back.common.ResponseMessage;
import com.capstone.board_back.dto.response.ResponseDto;
import lombok.Getter; // ✨ Lombok Getter import

@Getter // ✨ 추가하셔도 좋습니다!
public class DeleteCommentResponseDto extends ResponseDto {

    private DeleteCommentResponseDto() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<DeleteCommentResponseDto> success() {
        DeleteCommentResponseDto result = new DeleteCommentResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistComment() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_COMMENT, ResponseMessage.NOT_EXISTED_COMMENT);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    public static ResponseEntity<ResponseDto> notPermission() {
        ResponseDto result = new ResponseDto(ResponseCode.NO_PERMISSION, ResponseMessage.NO_PERMISSION);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistUser() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
}
