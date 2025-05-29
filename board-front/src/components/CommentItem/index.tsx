import './style.css'
import { CommentFavoriteListItem, CommentListItem } from 'types/interface'
import defaultProfileImage from 'assets/image/default-profile-image.png'
import dayjs from 'dayjs'
import { useLoginUserStore } from 'stores';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { PutCommentFavoriteResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';
import { toast } from 'react-toastify';
import GetCommentFavoriteListResponseDto from 'apis/response/board/get-comment-favorite-list.response.dto';
import { getCommentFavoriteListRequest, PutCommentFavoriteRequest } from 'apis';


interface Props {
    commentListItem: CommentListItem;
    // ✨ 삭제 처리를 위한 함수를 props로 받습니다 (BoardDetail 컴포넌트에서 전달)
    onDeleteComment: (commentNumber: number) => void;
}

//         component: Comment List Item 컴포넌트           //
export default function CommentItem({ commentListItem, onDeleteComment }: Props) { // ✨ onDeleteComment prop 추가

    //         properties:y           //
    // ✨ commentNumber와 userEmail을 props에서 가져옵니다.
    const { commentNumber, nickname, profileImage, writeDatetime, content, userEmail } = commentListItem;
    const { favoriteCount } = commentListItem;
const { loginUser } = useLoginUserStore(); // ✨ 로그인 유저 정보 가져오기

  //          state: 쿠키 상태          //
  const [cookies, setCookies] = useCookies();
  //          state: 좋아요 상태             //
  const [isFavorite, setFavorite] = useState<boolean>(false);
  //          state: 좋아요 리스트 상태             //
  const [favoriteList, setFavoriteList] = useState<CommentFavoriteListItem[]>([]);

  //          event handler: 좋아요 클릭 이벤트 처리          //
    const onCommentFavoriteClickHandler = () => {
    if (!commentNumber || !loginUser || !cookies.accessToken) return
    PutCommentFavoriteRequest(commentNumber, cookies.accessToken).then(putCommentFavoriteResponse);
    }
  
    //         function: 작성일 경과시간 함수           //
    const getElapsedTime = () => {
        const now = dayjs() // 한국 시간 기준으로 보정 (필요시)
        const writeTime = dayjs(writeDatetime);

        const gap = now.diff(writeTime, 's');
        if (gap < 60) return `${gap}초 전`;
        if (gap < 3600) return `${Math.floor(gap / 60)}분 전`;
        if (gap < 86400) return `${Math.floor(gap / 3600)}시간 전`;
        return `${Math.floor(gap / 86400)}일 전`;
    };

    // ✨ 삭제 아이콘 클릭 이벤트 핸들러
    const handleDeleteIconClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation(); // 부모 요소로의 이벤트 전파 중단 (예: comment-list-item 전체 클릭 방지)
        if (!commentNumber) return;
        // 부모 컴포넌트(BoardDetail)로부터 받은 삭제 함수 호출
        onDeleteComment(commentNumber);
    };
    //          function: get favorite list response 처리 함수          //
    const getCommentFavoriteListResponse = (responseBody: GetCommentFavoriteListResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'NB') toast('존재하지 않는 게시물입니다.');
      if (code === 'DBE') toast('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      const { commentFavoriteList } = responseBody as GetCommentFavoriteListResponseDto;
      setFavoriteList(commentFavoriteList);

      if (!loginUser) {
        setFavorite(false)
        return;
      }
      const isFavorite = commentFavoriteList.findIndex(favorite => favorite.email === loginUser.email) !== -1;
      setFavorite(isFavorite);
    }
  //          function: put comment favorite response 처리 함수         //
  const putCommentFavoriteResponse = (responseBody: PutCommentFavoriteResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === 'VF') toast('잘못된 접근입니다.');
    if (code === 'NU') toast('존재하지 않는 유저입니다.');
    if (code === 'NC') toast('존재하지 않는 게시물입니다.');
    if (code === 'AF') toast('인증에 실패했습니다.');
    if (code === 'DBE') toast('데이터베이스 오류입니다.');
    if (code !== 'SU') return;

    if (!commentNumber) return;
    getCommentFavoriteListRequest(commentNumber).then(getCommentFavoriteListResponse);
  }

  //            effect: 좋아요 갱신             //
  useEffect(() => {
    if (!commentNumber) return;
    getCommentFavoriteListRequest(commentNumber).then(getCommentFavoriteListResponse);
  }, [commentNumber]);

    //         render: Comment List Item 컴포넌트 렌더링           //
    return (
        <div className='comment-list-item'>
            <div className='comment-list-item-top'>
                <div className='comment-list-item-profile-box'>
                    <div className='comment-list-item-profile-image' style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})` }}></div>
                </div>
                <div className='comment-list-item-nickname'>{nickname}</div>
                <div className='comment-list-item-divider'>{'\|'}</div>
                <div className='comment-list-item-time'>{getElapsedTime()}</div>

                {/* ✨ 로그인한 사용자와 댓글 작성자가 같을 경우에만 삭제 아이콘 표시 */}
                {loginUser && loginUser.email === userEmail && (
                     <div className='icon-button comment-item-delete-button'onClick={handleDeleteIconClick} title='댓글 삭제'>
                        <div className='icon close-icon'></div> {/* App.css에 정의된 스타일 사용 */}
                    </div>
                )}
            </div>
            <div className='comment-list-item-main'>
                <div className='comment-list-item-content'>{content}</div>
        </div>
        <div className='comment-list-item-bottom'>
          <div className='icon-button' onClick={onCommentFavoriteClickHandler}>
            {isFavorite ?
            <div className='icon favorite-fill-icon'></div> :
            <div className='icon favorite-light-icon'></div>
            }
          </div>
          <div className='comment-list-item-favorite-count'>{favoriteList.length}</div>
            </div>
        </div>
    );
}