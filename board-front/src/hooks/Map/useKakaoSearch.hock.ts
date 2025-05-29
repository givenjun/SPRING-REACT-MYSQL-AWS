import { useState } from 'react';

export default function useKakaoSearch() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 });

  const searchPlaces = (keyword: string, onError?: () => void) => {
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(data);
        setCenter({ lat: parseFloat(data[0].y), lng: parseFloat(data[0].x) });
      } else {
        onError?.();
      }
    });
  };

  return { searchResults, center, searchPlaces };
}
