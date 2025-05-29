import React from 'react';
import './style.css';

interface SearchSidebarProps {
  searchResults: any[];
  onClickItem: (index: number) => void;
  selectedIndex: number | null;
  isOpen: boolean;
  toggleOpen: () => void;
  onSearch: (start: string, goal: string) => void;
}


export default function SearchSidebar({ isOpen, toggleOpen }: SearchSidebarProps) {
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
        <h2>경로상 휴게소 찾기</h2>
        <input type="text" placeholder="출발지 입력" />
        <input type="text" placeholder="도착지 입력" />
        <div className="button-group">
          <button>다시입력</button>
          <button>길찾기</button>
        </div>
        {/* 여기에 추가적인 안내/기록도 삽입 가능 */}
      </div>
    </div>
  );
}
