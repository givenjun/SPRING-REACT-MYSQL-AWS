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
import { usePagination } from 'hooks';
import { GetPopularListResponseDto } from 'apis/response/search';

declare global {
    interface Window {
        kakao: any;
    }
}
//         component: 메인 화면 컴포넌트      //
export default function Main() {
  //          function: 네비게이트 함수          //
  const navigate = useNavigate();
  //          state: 주간 top3 게시물 리스트 상태          //
  const [top3BoardList, setTop3BoardList] = useState<BoardListItem[]>([]);
  //          function: get top3 board list response 처리 함수          //
  const getTop3BoardListResponse = (responseBody: GetTop3BoardListResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const {code} = responseBody;
    if(code === 'DBE') alert('데이터베이스 오류입니다.');
    if(code !== 'SU') return;

    const {top3List} = responseBody as GetTop3BoardListResponseDto;
    setTop3BoardList(top3List);
  };

  //          effect: 첫 마운트 시 실행될 함수          //
  useEffect(() => {
    getTop3BoardListRequest().then(getTop3BoardListResponse);
  }, []);

  //         component: 메인 화면 상단 컴포넌트      //
  const MainTop = () => {
    // ✨ 지도를 담을 DOM 레퍼런스 생성
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        console.log("지도 초기화 useEffect 실행됨.");
        console.log("mapContainerRef.current:", mapContainerRef.current);
        console.log("window.kakao 객체:", window.kakao);
        if (window.kakao) {
            console.log("window.kakao.maps 객체:", window.kakao.maps);
        }

        if (window.kakao && window.kakao.maps && mapContainerRef.current) {
            console.log("카카오맵 SDK 및 컨테이너 준비 완료. 지도 초기화 시작...");
            
            // ✨ --- 이 부분이 실제 지도 생성 코드입니다 --- ✨
            const maps = window.kakao.maps; 
            const mapOption = {
                center: new maps.LatLng(36.351073954997, 127.29801308566), // 예시: 대전시청 좌표
                level: 5 
            };
            try {
                const map = new maps.Map(mapContainerRef.current, mapOption);
                console.log("카카오맵 초기화 성공:", map);

                // (선택 사항) 지도에 마커 표시 예시
                // const markerPosition  = new maps.LatLng(36.3504119, 127.3845475); 
                // const marker = new maps.Marker({
                //     position: markerPosition
                // });
                // marker.setMap(map);

            } catch (error) {
                console.error("카카오맵 초기화 중 오류 발생:", error);
            }
            // ✨ --- 지도 생성 코드 끝 --- ✨

        } else {
            console.warn("Kakao Maps SDK가 로드되지 않았거나, 맵 컨테이너를 찾을 수 없습니다.");
            if (!mapContainerRef.current) console.warn("mapContainerRef.current가 null입니다.");
            if (!window.kakao) console.warn("window.kakao 객체를 찾을 수 없습니다.");
            else if (!window.kakao.maps) console.warn("window.kakao.maps 객체를 찾을 수 없습니다.");
        }
    }, []); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행
    //         render: 메인 화면 상단 컴포넌트 렌더링      //
    return(
      <div id='main-top-wrapper'>
        <div className='main-top-container'>
          <div className='main-top-title'>{'Hoons board에서 \n다양한 이야기를 나눠보세요'}</div>
          {/* ✨ 여기에 카카오맵을 표시할 div 추가 */}
          <div ref={mapContainerRef} id="kakao-map-container" className='kakao-map-container'>
              {/* 지도는 여기에 그려집니다. */}
          </div>
          <div className='main-top-contents-box'>
            <div className='main-top-contents-title'>{'주간 TOP 3 게시글'}</div>
            <div className='main-top-contents'>
              {top3BoardList.map(top3ListItem => <Top3Item key={top3ListItem.boardNumber} top3ListItem={top3ListItem} />)}
            </div>
          </div>
        </div>
      </div>
    )
  }
  //         component: 메인 화면 하단 컴포넌트      //
  const MainBottom = () => {
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
      if(code === 'DBE') alert('데이터베이스 오류입니다.');
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
      if(code === 'DBE') alert('데이터베이스 오류입니다.');
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
      <div id='main-bottom-wrapper'>
        <div className='main-bottom-container'>
          <div className='main-bottom-title'>{'최신 게시물'}</div>
          <div className='main-bottom-contents-box'>
            <div className='main-bottom-current-contents'>
              {viewList.map(boardListItem => <BoardItem key={boardListItem.boardNumber} boardListItem={boardListItem} />)}
            </div>
            <div className='main-bottom-popular-box'>
              <div className='main-bottom-popular-card'>
                <div className='main-bottom-popular-card-container'>
                  <div className='main-bottom-popular-card-title'>{'인기 검색어'}</div>
                  <div className='main-bottom-popular-card-contens'>
                    {popularWordList.map((word, index) => (
                    <div key={word + index} className="word-badge" onClick={() => onPopularWordClickHandler(word)}>{word}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='main-bottom-pagination-box'>
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
      <MainTop />
      <MainBottom />
    </>
  )
}