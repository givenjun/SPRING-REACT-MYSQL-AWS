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
          <div className='main-top-title'>{'길찾기'}</div>
          {/* ✨ 여기에 카카오맵을 표시할 div 추가 */}
          <div ref={mapContainerRef} id="kakao-map-container" className='kakao-map-container'>
              {/* 지도는 여기에 그려집니다. */}
          </div>
        </div>
      </div>
    )
  }
  
  //         render: 메인 화면 컴포넌트 렌더링      //
  return (
    <>
      <MainTop />
    </>
  )
}