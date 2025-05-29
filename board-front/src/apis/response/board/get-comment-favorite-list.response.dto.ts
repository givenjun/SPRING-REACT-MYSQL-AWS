import { CommentFavoriteListItem } from "types/interface";
import ResponseDto from "../response.dto";

export default interface GetCommentFavoriteListResponseDto extends ResponseDto {
    commentFavoriteList: CommentFavoriteListItem[]
}