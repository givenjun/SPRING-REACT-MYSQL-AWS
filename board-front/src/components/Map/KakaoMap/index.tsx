import React from 'react';
import { Map, MapMarker, MapTypeControl, ZoomControl } from 'react-kakao-maps-sdk';

interface KakaoMapProps {
  center: { lat: number; lng: number };
  markers: any[];
  selectedIndex: number | null;
  onMarkerClick: (index: number) => void;
}

export default function KakaoMap({ center, markers, selectedIndex, onMarkerClick }: KakaoMapProps) {
  return (
    <Map center={center} style={{ width: '100%', height: '100%' }} level={4}>
      <MapTypeControl position="TOPRIGHT" />
      <ZoomControl position="RIGHT" />

      {markers.map((place, index) => (
        <MapMarker
          key={index}
          position={{ lat: parseFloat(place.y), lng: parseFloat(place.x) }}
          onClick={() => onMarkerClick(index)}
          clickable
        >
          {selectedIndex === index && (
            <div style={{ padding: '6px', backgroundColor: 'white', borderRadius: '4px' }}>
              {place.place_name}
            </div>
          )}
        </MapMarker>
      ))}
    </Map>
  );
}
