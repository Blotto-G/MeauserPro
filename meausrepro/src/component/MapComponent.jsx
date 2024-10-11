import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext.jsx";
import axios from "axios";
import {map} from "react-bootstrap/ElementChildren";

function MapComponent(props) {
    const { user } = useContext(UserContext);
    const { sendGeometry, sendInsGeometry, isDrawingEnabled, isDrawingEnabledMarker, setIsDrawingEnabled, setIsDrawingEnabledMarker, isModalOpen, isInsModalOpen, setIsMapReady } = props;

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


    const [insMarkerCoords, setInsMarkerCoords] = useState([]);
    const [currentInsMarker, setCurrentInsMarker] = useState(null);
    const [insMarkers, setInsMarkers] = useState() // 계측기 마커
    const [drawnInsMarker, setDrawnInsMarker] = useState([]); // 새로 그린 계측기 마커 관리
    const [currentInsMarkerId, setCurrentInsMarkerId] = useState(null); // 현재 계측기마커 ID 상태 추가

    // // 계측기 지오매트리 파싱
    // const insGeometryData = (insGeometryStr) => {
    //     if (!insGeometryStr || !insGeometryStr.startsWith('POINT')) {
    //         console.warn('유효하지 않은 지오메트리 데이터:', insGeometryStr);
    //         return null; // 마커는 하나의 좌표만 있으므로 null 반환
    //     }
    //
    //     const insGeometry = insGeometryStr
    //         .replace("POINT(", "")
    //         .replace(")", "")
    //         .trim()
    //
    //     const [lng, lat] = insGeometry.split(" ");
    //
    //     return new naver.maps.LatLng(parseFloat(lat), parseFloat(lng));
    // };
    //
    // // 진행 중인 계측기 마커 불러오기
    // useEffect(() => {
    //     if (sectionId) {
    //         axios
    //             .get(`http://localhost:8080/MeausrePro/Instrument/${sectionId}`)
    //             .then((res) => {
    //                 const { data } = res;
    //                 setInsMarkers(data); // 전체 계측기 데이터를 저장
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //             });
    //     }
    // }, [sectionId]);


    // // 저장된 계측기 마커를 지도에 그리기
    // useEffect(() => {
    //     if (mapInstance && insMarkers.length > 0) {
    //         drawnInsMarker.forEach((marker) => marker.setMap(null)); // 기존 폴리곤을 먼저 지운다.
    //
    //         const newInsMarkers = insMarkers.map((instrument) => {
    //             if (!instrument.insGeometry) {
    //                 console.warn("유효하지 않은 지오메트리 데이터:", instrument);
    //                 return null;
    //             }
    //
    //             const insGeometry = insGeometryData(instrument.insGeometry);
    //             if (insGeometry.length === 0) return null;
    //
    //             const insMarker = new naver.maps.Marker({
    //                 position: new naver.maps.LatLng(37.3595704, 127.105399),
    //                 map: map,
    //                 icon: {
    //                     url: markerIcon,
    //                     scaledSize: new naver.maps.Size(20, 20), // 아이콘 크기 조정
    //                 },
    //             });
    //
    //             // 우클릭 이벤트 추가
    //             naver.maps.Event.addListener(insMarker, "rightclick", function (e) {
    //                 setContextMenuVisible(true);
    //                 setContextMenuPosition({
    //                     x: e.pointerEvent.pageX,
    //                     y: e.pointerEvent.pageY,
    //                 });
    //                 setCurrentInsMarker(insMarker);
    //                 setCurrentInsMarkerId(insMarker.idx); // 저장된 폴리곤 ID 설정
    //
    //                 // 현재 계측기 마커의 좌표를 상태에 저장 (수정할 수 있도록)
    //                 const markerPosition = marker.getPosition();
    //                 const coords = [markerPosition.lat(), markerPosition.lng()];
    //                 setInsMarkerCoords(coords);  // 상태에 저장
    //             });
    //
    //             return insMarker;
    //         }).filter(insMarker => insMarker !== null); // 유효한 계측기 마커만 남김
    //
    //         setDrawnInsMarker(newInsMarkers);
    //     }
    // }, [mapInstance, insMarkers]);
    //
    //
    // 계측기 추가 모드가 활성화되면 기존 마커 숨기기
    useEffect(() => {
        if (isDrawingEnabledMarker) {
            // 모든 저장된 계측기 마커를 지도에서 숨김
            drawnInsMarker.forEach((insMarker) => insMarker.setMap(null));
        } else if (!isInsModalOpen && drawnInsMarker.length > 0) {
            // 모달이 닫히면 기존 계측기 마커 다시 표시
            drawnInsMarker.forEach((insMarker) => insMarker.setMap(mapInstance));
        }
    }, [isDrawingEnabledMarker, isInsModalOpen]);


    // 새로운 계측기 마커 그리기
    const createInsMarker = (map) => {
        const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(37.3595704, 127.105399),
            map: map,
        });

        naver.maps.Event.addListener(map, "click", function (e) {
            if (isDrawingEnabledMarker && marker.getMap() !== null) {
                const point = e.latlng;

                marker.setPosition(point);
            }
        });

        // 우클릭으로 계측기 마커를 확정하거나 다시 그리기
        naver.maps.Event.addListener(marker, "rightclick", function (e) {
            setContextMenuVisible(true);
            setContextMenuPosition({
                x: e.pointerEvent.pageX,
                y: e.pointerEvent.pageY,
            });
            setCurrentInsMarker(marker);
        });
        setCurrentInsMarker(marker);
    };


    // 계측기 마커 생성 모드
    useEffect(() => {
        if (isDrawingEnabledMarker && mapInstance) {
            createInsMarker(mapInstance);
        }
    }, [isDrawingEnabledMarker, mapInstance]);


    const handleSaveIns = () => {
        if (insMarkerCoords.length === 0) {
            console.log("저장할 좌표가 없습니다.");
            return;
        }

        // 좌표를 부모 컴포넌트로 전송
        sendInsGeometry(insMarkerCoords);

        // 계측기 마커가 존재하면 지도에서 제거
        if (currentInsMarker) {
            currentInsMarker.setMap(null);
        }

        // 상태 업데이트 (계측기 마커 좌표 초기화 및 상태 리셋)
        setInsMarkerCoords([]);
        setCurrentInsMarker(null);
        setIsDrawingEnabledMarker(false);
        setContextMenuVisible(false);

        console.log("좌표 저장 완료:", insMarkerCoords);

        // 계측기 마커 다시 그리기 로직 추가
        // 서버에서 데이터를 다시 가져오는 대신, 바로 화면에 업데이트
        const newInsMarker = new naver.maps.Marker({
            map: mapInstance, // 현재 지도 인스턴스에 추가
            position: insMarkerCoords.map(([lat, lng]) => new naver.maps.LatLng(lat, lng))
        });

        // 저장된 계측기 마커를 상태에 저장
        setDrawnInsMarker([...drawnInsMarker, newInsMarker]);
    };


    // 다시 그리기
    const handleInsReset = () => {
        if (currentInsMarker) {
            currentInsMarker.setMap(null); // 기존 계측기 마커 제거
        }

        setInsMarkerCoords([]); // 계측기 마커 좌표 초기화
        setCurrentInsMarker(null); // 현재 계측기 마커 초기화
        setIsDrawingEnabledMarker(true); // 그리기 활성화
        setContextMenuVisible(false); // 컨텍스트 메뉴 숨기기

        if (mapInstance) {
            createInsMarker(mapInstance); // 다시 계측기 마커를 그릴 수 있도록 호출
        }
    };


    const handleSaveInsGeometry = () => {
        if (currentInsMarker && currentInsMarkerId) {
            const wkt = `POINT(${insMarkerCoords[1]} ${insMarkerCoords[0]})`;

            // 서버에 지오메트리 업데이트 요청
            const insGeometryDto = {
                insGeometryData: wkt,
                idx: currentInsMarkerId,
            };

            axios.put(`http://localhost:8080/MeausrePro/Instrument/updateInsGeometry`, insGeometryDto)
                .then(() => {
                    currentInsMarker.setMap(null); // 그려진 계측기 마커 제거
                    setInsMarkerCoords([]); // 계측기 마커 좌표 초기화
                    setCurrentInsMarker(null);
                    setContextMenuVisible(false);

                    // 서버에서 업데이트된 데이터 다시 불러오기
                    axios.get(`http://localhost:8080/MeausrePro/Instrument/${id}`)
                        .then(res => {
                            const { data } = res;
                            setInsMarkers(data); // 서버에서 새로운 계측기 마커 데이터 받아와서 업데이트
                        })
                        .catch(err => {
                            console.error("계측기 마커 데이터 다시 불러오기 실패:", err);
                        });
                })
                .catch((error) => {
                    console.error("계측기 지오메트리 저장 실패:", error);
                });
        }
    };




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
                .get(`http://localhost:8080/MeausrePro/Project/inProgress/${encodeURIComponent(user.id)}/${user.topManager}`)
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
        <div className={'w-100 h-100 d-flex flex-column justify-content-center align-items-center pt-3'}>
            <div className={'input-group mb-4'} style={{width: '300px'}}>
                <input
                    type="text"
                    value={searchQuery}
                    className={'form-control'}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="주소를 입력하세요"
                    style={{marginRight: "5px"}}
                />
                <div className={'input-group-text'}>
                    <button type={'button'}
                            onClick={handleSearch}
                            className={'checkPwBtn'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-search" viewBox="0 0 16 16">
                            <path
                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div id="map" style={{width: "100%", height: "100%"}}></div>
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
                    {currentPolygonId && currentInsMarkerId ? (
                        <>
                            <button onClick={handleSaveInsGeometry}>저장</button>
                            {/* 기존 계측기 마커 저장 */}
                            <button onClick={handleInsReset}>다시 그리기</button>
                            {/* 기존 계측기 마커 다시 그리기 */}
                        </>
                    ) : (
                        <>
                            <button onClick={handleSaveIns}>저장</button>
                            {/* 신규 계측기 마커 저장 */}
                            <button onClick={handleInsReset}>다시 그리기</button>
                            {/* 신규 계측기 마커 다시 그리기 */}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default MapComponent;