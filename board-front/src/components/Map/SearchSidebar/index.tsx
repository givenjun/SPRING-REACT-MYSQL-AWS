import React from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { BOARD_PATH, USER_PATH } from 'constant';

interface SearchSidebarProps {
  searchResults: any[];
  onClickItem: (index: number) => void;
  selectedIndex: number | null;
  isOpen: boolean;
  toggleOpen: () => void;
  onSearch: (start: string, goal: string) => void;
}


export default function SearchSidebar({ isOpen, toggleOpen }: SearchSidebarProps) {

  const navigate = useNavigate();

  const onBoardClickHandler = () => {
    navigate(BOARD_PATH());
  }
  const onUserClickHandler = () => {
    navigate(USER_PATH(''));
  }

  return (
    <div className={`slideContainer ${isOpen ? 'active' : ''}`}>
      {/* 열기/닫기 버튼 */}
      <div className="slideBtnContainer">
        <div className={`slideBtn ${isOpen ? 'active' : ''}`} onClick={toggleOpen}>
          {isOpen ? 
          <div className='icon-box'>
            <div className='icon expand-left-icon'></div>
          </div> : 
          <div className='icon-box'>
            <div className='icon expand-right-icon'></div>
          </div>
          }
        </div>
      </div>

      {/* 사이드 내용 */}
      <div className="sidebar-content">
        <div className="sidebar-title">{`Hanbat Map`}</div>
        <div className="sidebar-search-input-box">
          <div className="search-input-wrapper">
            <input type="text" placeholder="장소, 주소 검색" />
            <div className="search-icon">
              <div className="icon search-light-icon"></div>
            </div>
          </div>
        </div>
        <div className="button-group">
          <button className='button'>{`탐색`}</button>
          <button className='button'>{`길찾기`}</button>
          <button className='button' onClick={onBoardClickHandler}>{`커뮤니티`}</button>
          <button className='button' onClick={onUserClickHandler}>{`MY`}</button>
        </div>
        {/* 여기에 추가적인 안내/기록도 삽입 가능 */}
      </div>
    </div>
  );
}
