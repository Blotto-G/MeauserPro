import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext.jsx";
import axios from "axios";

function MapComponent(props) {
    const { user } = useContext(UserContext);
    const { sendGeometry, isDrawingEnabled, setIsDrawingEnabled, isModalOpen } = props;

    const [polygonCoords, setPolygonCoords] = useState([]);
    const [currentPolygon, setCurrentPolygon] = useState(null);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [mapInstance, setMapInstance] = useState(null);
    const [polygons, setPolygons] = useState([]); // 저장된 폴리곤 목록
    const [drawnPolygons, setDrawnPolygons] = useState([]); // 새로 그린 폴리곤 관리
    const [currentPolygonId, setCurrentPolygonId] = useState(null); // 현재 폴리곤 ID 상태 추가
    const [markers, setMarkers] = useState([]); // 동그란 점(마커)을 저장할 배열을 상태로 선언
    const [searchQuery, setSearchQuery] = useState(""); // 주소 검색 기능

    // 지도 로드
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
                    position: naver.maps.Position.RIGHT_CENTER,
                },
            };

            const map = new naver.maps.Map("map", mapOptions);
            setMapInstance(map);
            setIsMapReady(true);
            console.log("Map instance has been set:", map); // 추가된 로그
        };

        if (window.naver && window.naver.maps) {
            initMap();
        } else {
            const script = document.createElement("script");
            script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=jxpgjljq8x&submodules=geocoder`;
            script.async = true;
            script.onload = initMap;
            document.head.appendChild(script);
        }
    }, []);

    // string 형식 지오매트리 파싱
    const geometryData = (geometryStr) => {
        if (!geometryStr || !geometryStr.startsWith('POLYGON')) {
            console.warn('유효하지 않은 지오메트리 데이터:', geometryStr);
            return [];
        }

        const geometry = geometryStr
            .replace("POLYGON((", "")
            .replace("))", "")
            .split(",")
            .map((coord) => {
                const [lng, lat] = coord.trim().split(" ");
                return new naver.maps.LatLng(parseFloat(lat), parseFloat(lng));
            });

        return geometry;
    };

    // 진행 중인 프로젝트 폴리곤 불러오기
    useEffect(() => {
        if (user && user.id) {
            axios
                .get(`http://localhost:8080/MeausrePro/Project/inProgress/${user.id}`)
                .then((res) => {
                    const { data } = res;
                    setPolygons(data); // 전체 프로젝트 데이터를 저장
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [user]);


    // 저장된 폴리곤을 지도에 그리기
    useEffect(() => {
        if (mapInstance && polygons.length > 0) {
            drawnPolygons.forEach((polygon) => polygon.setMap(null)); // 기존 폴리곤을 먼저 지운다.

            const newPolygons = polygons.map((project) => {
                if (!project.geometry) {
                    console.warn("유효하지 않은 지오메트리 데이터:", project);
                    return null;
                }

                const geometry = geometryData(project.geometry);
                if (geometry.length === 0) return null;

                const polygon = new naver.maps.Polygon({
                    map: mapInstance,
                    paths: geometry,
                    fillColor: "#fdb74f",
                    fillOpacity: 0.5,
                    strokeColor: "#fdb74f",
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    clickable: true,
                });

                // 우클릭 이벤트 추가
                naver.maps.Event.addListener(polygon, "rightclick", function (e) {
                    setContextMenuVisible(true);
                    setContextMenuPosition({
                        x: e.pointerEvent.pageX,
                        y: e.pointerEvent.pageY,
                    });
                    setCurrentPolygon(polygon);
                    setCurrentPolygonId(project.idx); // 저장된 폴리곤 ID 설정

                    // 현재 폴리곤의 좌표를 상태에 저장 (수정할 수 있도록)
                    const currentPath = polygon.getPaths().getAt(0).getArray();
                    const coords = currentPath.map(latlng => [latlng.lat(), latlng.lng()]);
                    setPolygonCoords(coords);
                });

                return polygon;
            }).filter(polygon => polygon !== null); // 유효한 폴리곤만 남김

            setDrawnPolygons(newPolygons);
        }
    }, [mapInstance, polygons]);


    // 프로젝트 생성 모드가 활성화되면 기존 폴리곤 숨기기
    useEffect(() => {
        if (isDrawingEnabled) {
            // 모든 저장된 폴리곤을 지도에서 숨김
            drawnPolygons.forEach((polygon) => polygon.setMap(null));
        } else if (!isModalOpen && drawnPolygons.length > 0) {
            // 모달이 닫히면 기존 폴리곤 다시 표시
            drawnPolygons.forEach((polygon) => polygon.setMap(mapInstance));
        }
    }, [isDrawingEnabled, isModalOpen]);

    // 새로운 폴리곤 그리기
    const createPolygon = (map) => {
        const polygon = new naver.maps.Polygon({
            map: map,
            paths: [[]],
            fillColor: "#4285F4",
            fillOpacity: 0.3,
            strokeColor: "#4285F4",
            strokeOpacity: 0.6,
            strokeWeight: 3,
            clickable: true,
        });

        // 클릭할 때마다 점을 추가하고 폴리곤의 좌표를 업데이트
        naver.maps.Event.addListener(map, "click", function (e) {
            if (isDrawingEnabled && polygon.getMap() !== null) {
                const point = e.latlng;
                const path = polygon.getPaths().getAt(0);
                path.push(point);

                // 동그란 점(마커) 추가
                const circle = new naver.maps.Circle({
                    map: map,
                    center: point,
                    radius: 10,  // 동그란 점의 크기
                    fillColor: "#4285F4",  // 점 색상
                    fillOpacity: 1,
                    strokeWeight: 0,  // 경계선 제거
                });
                setMarkers((prevMarkers) => [...prevMarkers, circle]);

                const updatedCoords = path.getArray().map((latlng) => [latlng.lat(), latlng.lng()]);
                setPolygonCoords(updatedCoords);
            }
        });

        // 우클릭으로 폴리곤을 확정하거나 다시 그리기
        naver.maps.Event.addListener(polygon, "rightclick", function (e) {
            setContextMenuVisible(true);
            setContextMenuPosition({
                x: e.pointerEvent.pageX,
                y: e.pointerEvent.pageY,
            });
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
        if (polygonCoords.length === 0) {
            console.log("저장할 좌표가 없습니다.");
            return;
        }

        // 좌표를 부모 컴포넌트로 전송
        sendGeometry(polygonCoords);

        // 폴리곤이 존재하면 지도에서 제거
        if (currentPolygon) {
            currentPolygon.setMap(null);
        }

        // 마커들 제거
        markers.forEach((circle) => circle.setMap(null));
        setMarkers([]); // 마커 배열 초기화

        // 상태 업데이트 (폴리곤 좌표 초기화 및 상태 리셋)
        setPolygonCoords([]);
        setCurrentPolygon(null);
        setIsDrawingEnabled(false);
        setContextMenuVisible(false);

        console.log("좌표 저장 완료:", polygonCoords);

        // 폴리곤 다시 그리기 로직 추가
        // 서버에서 데이터를 다시 가져오는 대신, 바로 화면에 업데이트
        const newPolygon = new naver.maps.Polygon({
            map: mapInstance, // 현재 지도 인스턴스에 추가
            paths: polygonCoords.map(([lat, lng]) => new naver.maps.LatLng(lat, lng)),
            fillColor: "#fdb74f",
            fillOpacity: 0.5,
            strokeColor: "#fdb74f",
            strokeOpacity: 0.8,
            strokeWeight: 3,
            clickable: true,
        });

        // 저장된 폴리곤을 상태에 저장
        setDrawnPolygons([...drawnPolygons, newPolygon]);
    };

    // 다시 그리기
    const handleReset = () => {
        if (currentPolygon) {
            currentPolygon.setMap(null); // 기존 폴리곤 제거
            markers.forEach((circle) => circle.setMap(null)); // 상태에 저장된 점을 지도에서 제거
            setMarkers([]); // markers 배열 초기화
        }

        setPolygonCoords([]); // 폴리곤 좌표 초기화
        setCurrentPolygon(null); // 현재 폴리곤 초기화
        setIsDrawingEnabled(true); // 그리기 활성화
        setContextMenuVisible(false); // 컨텍스트 메뉴 숨기기

        if (mapInstance) {
            createPolygon(mapInstance); // 다시 폴리곤을 그릴 수 있도록 호출
        }
    };


    const handleSaveGeometry = () => {
        if (currentPolygon && currentPolygonId) {
            const wkt = `POLYGON((${polygonCoords.map(coord => `${coord[1]} ${coord[0]}`).join(', ')}))`;

            // 서버에 지오메트리 업데이트 요청
            const geometryDto = {
                geometryData: wkt,
                idx: currentPolygonId,
            };

            axios.put(`http://localhost:8080/MeausrePro/Project/updateGeometry`, geometryDto)
                .then(() => {
                    currentPolygon.setMap(null); // 그려진 폴리곤 제거
                    markers.forEach((circle) => circle.setMap(null)); // 마커 제거
                    setMarkers([]); // 마커 배열 초기화
                    setPolygonCoords([]); // 폴리곤 좌표 초기화
                    setCurrentPolygon(null);
                    setContextMenuVisible(false);

                    // 서버에서 업데이트된 데이터 다시 불러오기
                    axios.get(`http://localhost:8080/MeausrePro/Project/inProgress/${user.id}`)
                        .then(res => {
                            const { data } = res;
                            setPolygons(data); // 서버에서 새로운 폴리곤 데이터 받아와서 업데이트
                        })
                        .catch(err => {
                            console.error("폴리곤 데이터 다시 불러오기 실패:", err);
                        });
                })
                .catch((error) => {
                    console.error("지오메트리 저장 실패:", error);
                });
        }
    };
    

    // 주소 검색 처리 함수
    const handleSearch = () => {
        if (searchQuery.trim() === "") return;

        axios
            .get(`http://localhost:8080/MeausrePro/Maps/geocode?query=${encodeURIComponent(searchQuery)}`)
            .then((response) => {
                const data = response.data;
                if (data && data.addresses && data.addresses.length > 0) {
                    const { x, y } = data.addresses[0]; // 좌표 가져오기
                    const newCenter = new naver.maps.LatLng(y, x);

                    if (mapInstance) {
                        mapInstance.setCenter(newCenter); // 지도 중심 이동
                    }
                } else {
                    console.warn("주소를 찾을 수 없습니다.");
                }
            })
            .catch((error) => {
                console.error("주소 검색 중 오류 발생:", error);
            });
    };

    return (
        <>
            <div id="map" style={{width: "600px", height: "500px"}}></div>
            <div style={{marginBottom: "10px"}}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="주소를 입력하세요"
                    style={{marginRight: "5px"}}
                />
                <button onClick={handleSearch}>주소 검색</button>
            </div>
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
                    }}
                >
                    {currentPolygonId ? (
                        <>
                            <button onClick={handleSaveGeometry}>저장</button>
                            {/* 기존 폴리곤 저장 */}
                            <button onClick={handleReset}>다시 그리기</button>
                            {/* 기존 폴리곤 다시 그리기 */}
                        </>
                    ) : (
                        <>
                            <button onClick={handleSave}>저장</button>
                            {/* 신규 폴리곤 저장 */}
                            <button onClick={handleReset}>다시 그리기</button>
                            {/* 신규 폴리곤 다시 그리기 */}
                        </>
                    )}
                </div>
            )}

        </>
    );
}

export default MapComponent;
