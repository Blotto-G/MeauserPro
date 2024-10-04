import {useEffect, useState} from "react";

function MapComponent(props) {
    const {sendGeometry, isDrawingEnabled, setIsDrawingEnabled} = props;
    const [polygonCoords, setPolygonCoords] = useState([]);
    const [currentPolygon, setCurrentPolygon] = useState(null);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [mapInstance, setMapInstance] = useState(null);
    const [drawingEnabled, setDrawingEnabled] = useState(false);

    useEffect(() => {
        const initMap = () => {
            if (!window.naver || !naver.maps) {
                console.log("Map 로드 중");
                return;
            }

            const mapOptions = {
                center: new naver.maps.LatLng(37.3595704, 127.105399),
                zoom: 15,
                zoomControl: true,
                zoomControlOptions: {
                    position: naver.maps.Position.RIGHT_CENTER
                }
            };

            // 여기서 'map'이라는 id를 가진 div에 지도를 렌더링합니다.
            const map = new naver.maps.Map('map', mapOptions);
            setMapInstance(map);
        };

        if (window.naver && window.naver.maps) {
            initMap();
        } else {
            const script = document.createElement("script");
            script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_CLIENT_ID&submodules=geocoder`;
            script.async = true;
            script.onload = () => {
                if (window.naver && window.naver.maps) {
                    initMap();
                }
            };
            document.head.appendChild(script);
        }
    }, []);

    const createPolygon = (map) => {
        const polygon = new naver.maps.Polygon({
            map: map,
            paths: [[]],
            fillColor: '#ff0000',
            fillOpacity: 0.3,
            strokeColor: '#ff0000',
            strokeOpacity: 0.6,
            strokeWeight: 3,
            clickable: true
        });

        naver.maps.Event.addListener(map, 'click', function (e) {
            if (isDrawingEnabled && polygon.getMap() !== null) {
                const point = e.latlng;
                const path = polygon.getPaths().getAt(0);
                path.push(point);

                const updatedCoords = path.getArray().map(latlng => [latlng.lat(), latlng.lng()]);
                setPolygonCoords(updatedCoords);
            }
        });

        // 새로 그린 폴리곤에 대한 우클릭 이벤트
        naver.maps.Event.addListener(polygon, 'rightclick', function (e) {
            setContextMenuVisible(true);
            setContextMenuPosition({ x: e.offset.x, y: e.offset.y });
            setCurrentPolygon(polygon);
        });

        setCurrentPolygon(polygon);
    };

    // 폴리곤 생성 모드
    useEffect(() => {
        if (isDrawingEnabled && mapInstance) {
            createPolygon(mapInstance);
        }
    }, [isDrawingEnabled, mapInstance]);

    const handleSave = () => {
        if (polygonCoords.length > 0) {
            // 현재 그려진 폴리곤을 저장
            const wkt = `POLYGON((${polygonCoords.map(coord => `${coord[1]} ${coord[0]}`).join(', ')}))`;
            console.log("전송할 WKT 데이터:", wkt);
            sendGeometry(polygonCoords);  // 부모 컴포넌트로 좌표 전송
            setIsDrawingEnabled(false);
            setContextMenuVisible(false);
        } else {
            console.log('저장할 좌표가 없습니다.');
        }
    };

    return (
        <>
            <div id="map" style={{ width: '500px', height: '500px' }}></div>
            {contextMenuVisible && (
                <div
                    style={{
                        position: 'absolute',
                        top: `${contextMenuPosition.y}px`,
                        left: `${contextMenuPosition.x}px`,
                        background: '#fff',
                        padding: '10px',
                        border: '2px solid #333',
                        zIndex: '1000'
                    }}>
                    <button onClick={handleSave}>저장</button>
                </div>
            )}
        </>
    );
}

export default MapComponent;
