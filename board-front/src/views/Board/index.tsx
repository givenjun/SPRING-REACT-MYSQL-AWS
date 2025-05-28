import React, { useEffect, useState, useRef  } from 'react'
import './style.css';
import Top3Item from 'components/Top3Item';
import { BoardListItem } from 'types/interface';
import BoardItem from 'components/BoardItem';
import Pagination from 'components/Pagination';
import { useNavigate } from 'react-router-dom';
import { SEARCH_PATH } from 'constant';
import { getLatestBoardListRequest, getPopularListRequest, getTop3BoardListRequest } from 'apis';
import { GetLatestBoardListResponseDto, GetTop3BoardListResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';
import { customErrToast, usePagination } from 'hooks';
import { GetPopularListResponseDto } from 'apis/response/search';

//         component: 메인 화면 컴포넌트      //
export default function Board() {

  //          function: 네비게이트 함수          //
  const navigate = useNavigate();
  //          state: 주간 top3 게시물 리스트 상태          //
  const [top3BoardList, setTop3BoardList] = useState<BoardListItem[]>([]);
  //          function: get top3 board list response 처리 함수          //
  const getTop3BoardListResponse = (responseBody: GetTop3BoardListResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const {code} = responseBody;
    if(code === 'DBE') customErrToast('데이터베이스 오류입니다.');
    if(code !== 'SU') return;

    const {top3List} = responseBody as GetTop3BoardListResponseDto;
    setTop3BoardList(top3List);
  };

  //          effect: 첫 마운트 시 실행될 함수          //
  useEffect(() => {
    getTop3BoardListRequest().then(getTop3BoardListResponse);
  }, []);

  //         component: 메인 화면 상단 컴포넌트      //
  const BoardTop = () => {
    // ✨ 지도를 담을 DOM 레퍼런스 생성
    //         render: 메인 화면 상단 컴포넌트 렌더링      //
    return(
      <div id='board-top-wrapper'>
        <div className='board-top-container'>
          <div className='board-top-contents-box'>
            <div className='board-top-contents-title'>{'주간 TOP 3 게시글'}</div>
            <div className='board-top-contents'>
              {top3BoardList.map(top3ListItem => <Top3Item key={top3ListItem.boardNumber} top3ListItem={top3ListItem} />)}
            </div>
          </div>
        </div>
      </div>
    )
  }
  //         component: 메인 화면 하단 컴포넌트      //
  const BoardBottom = () => {
    //          state: 페이지네이션 관련 상태         //
    const {
        currentPage,
        setCurrentPage,
        currentSection,
        setCurrentSection,
        viewList,
        viewPageList,
        totalSection,
        setTotalList
    } = usePagination<BoardListItem>(5);
    
    //          state: 인기 검색어 리스트 상태         //
    const [popularWordList, setPopularWordList] = useState<string[]>([]);
    //          function: get latest board list response 처리 함수          //
    const getLatestBoardListResponse = (responseBody: GetLatestBoardListResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const {code} = responseBody;
      if(code === 'DBE') customErrToast('데이터베이스 오류입니다.');
      if(code !== 'SU') return;

      const {latestList} = responseBody as GetLatestBoardListResponseDto;
      // --- 👇 테스트 코드: totalSection이 2가 되도록 강제 설정 👇 ---
      // const testList: BoardListItem[] = [];
      // // 60개의 더미 항목 생성 (51개~100개 사이면 totalSection이 2가 됩니다)
      // for (let i = 0; i < 60; i++) {
      //   testList.push({
      //     boardNumber: i + 1, // 고유한 boardNumber를 보장합니다.
      //     title: `테스트 최신 게시물 제목 ${i + 1}`,
      //     content: `테스트 최신 게시물 내용 ${i + 1}`,
      //     boardTitleImage: null,
      //     writeDatetime: `2023-05-26 12:00:00`,
      //     viewCount: Math.floor(Math.random() * 100),
      //     commentCount: Math.floor(Math.random() * 10),
      //     favoriteCount: Math.floor(Math.random() * 50),
      //     writerNickname: `테스트유저${i}`,
      //     writerProfileImage: null,
      //   });
      // }
      // setTotalList(testList); // 생성된 테스트 리스트를 사용합니다.
      // --- 👆 테스트 코드 👆 ---
      setTotalList(latestList);
    }
    //          function: get popular list response 처리 함수          //
    const getPopularListResponse = (responseBody: GetPopularListResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const {code} = responseBody;
      if(code === 'DBE') customErrToast('데이터베이스 오류입니다.');
      if(code !== 'SU') return;

       const {popularWordList} = responseBody as GetPopularListResponseDto;
       setPopularWordList(popularWordList);
    };
    //          event handler: 인기 검색어 클릭 이벤트 처리         //
    const onPopularWordClickHandler = (word: string) => {
      navigate(SEARCH_PATH(word));
    };
    //          effect: 첫 마운트 시 실행될 함수          //
    useEffect(() => {
      getLatestBoardListRequest().then(getLatestBoardListResponse);
      getPopularListRequest().then(getPopularListResponse);
    }, []);
    //         render: 메인 화면 하단 컴포넌트 렌더링      //
    return(
      <div id='board-bottom-wrapper'>
        <div className='board-bottom-container'>
          <div className='board-bottom-title'>{'최신 게시물'}</div>
          <div className='board-bottom-contents-box'>
            <div className='board-bottom-current-contents'>
              {viewList.map(boardListItem => <BoardItem key={boardListItem.boardNumber} boardListItem={boardListItem} />)}
            </div>
            <div className='board-bottom-popular-box'>
              <div className='board-bottom-popular-card'>
                <div className='board-bottom-popular-card-container'>
                  <div className='board-bottom-popular-card-title'>{'인기 검색어'}</div>
                  <div className='board-bottom-popular-card-contens'>
                    {popularWordList.map((word, index) => (
                    <div key={word + index} className="word-badge" onClick={() => onPopularWordClickHandler(word)}>{word}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='board-bottom-pagination-box'>
            <Pagination 
            currentPage={currentPage}
            currentSection={currentSection}
            setCurrentPage={setCurrentPage}
            setCurrentSection={setCurrentSection}
            viewPageList={viewPageList}
            totalSection={totalSection}
            />
          </div>
        </div>
      </div>
    )
  }
  //         render: 메인 화면 컴포넌트 렌더링      //
  return (
    <>
      <BoardTop />
      <BoardBottom />
    </>
  )
}