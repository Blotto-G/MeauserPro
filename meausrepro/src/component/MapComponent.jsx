import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext.jsx";
import axios from "axios";

function MapComponent(props) {
    const { user } = useContext(UserContext);
    const { sendGeometry, isDrawingEnabled, setIsDrawingEnabled, isModalOpen, projectList } = props;

    const [polygonCoords, setPolygonCoords] = useState([]);
    const [currentPolygon, setCurrentPolygon] = useState(null);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [mapInstance, setMapInstance] = useState(null);
    const [polygons, setPolygons] = useState([]); // 저장된 폴리곤 목록
    const [drawnPolygons, setDrawnPolygons] = useState([]); // 새로 그린 폴리곤 관리

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

    // string 형식 지오매트리 파싱
    const geometryData = (geometryStr) => {
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
        axios
            .get(`http://localhost:8080/MeausrePro/Project/inProgress/${user.id}`)
            .then((res) => {
                const { data } = res;
                const geometry = data.map((pro) => pro.geometry);
                setPolygons(geometry);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [user]);

    // 저장된 폴리곤을 지도에 그리기
    useEffect(() => {
        if (mapInstance && projectList.length > 0) {
            const newPolygons = projectList.map((project) => {
                const geometry = geometryData(project.geometry);

                const polygon = new naver.maps.Polygon({
                    map: mapInstance,
                    paths: geometry,
                    fillColor: "#a8e8a8",
                    fillOpacity: 0.1,
                    strokeColor: "#a8e8a8",
                    strokeOpacity: 0.5,
                    strokeWeight: 2,
                });

                return polygon;
            });

            setDrawnPolygons(newPolygons);
        }
    }, [mapInstance, projectList]);

    // 프로젝트 생성 모드가 활성화되면 현재 그려진 폴리곤 삭제 및 저장된 폴리곤 표시
    useEffect(() => {
        if (isDrawingEnabled) {
            // 모든 저장된 폴리곤을 지도에서 숨김
            drawnPolygons.forEach((polygon) => polygon.setMap(null));
        } else if (!isModalOpen && drawnPolygons.length > 0) {
            // 폴리곤 생성 취소 시 현재 그린 폴리곤 삭제
            if (currentPolygon) {
                currentPolygon.setMap(null);
                setCurrentPolygon(null); // 현재 그린 폴리곤 초기화
            }
            // 모달이 닫히면 저장된 폴리곤 다시 표시
            drawnPolygons.forEach((polygon) => polygon.setMap(mapInstance));
        }
    }, [isDrawingEnabled, isModalOpen, currentPolygon, drawnPolygons, mapInstance]);

    // 새로운 폴리곤 그리기
    const createPolygon = (map) => {
        const polygon = new naver.maps.Polygon({
            map: map,
            paths: [[]],
            fillColor: "#75c6ea",
            fillOpacity: 0.3,
            strokeColor: "#75c6ea",
            strokeOpacity: 0.6,
            strokeWeight: 2,
            clickable: true,
        });

        naver.maps.Event.addListener(map, "click", function (e) {
            if (isDrawingEnabled && polygon.getMap() !== null) {
                const point = e.latlng;
                const path = polygon.getPaths().getAt(0);
                path.push(point);

                const updatedCoords = path
                    .getArray()
                    .map((latlng) => [latlng.lat(), latlng.lng()]);
                setPolygonCoords(updatedCoords);
            }
        });

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

    // 좌표 저장
    const handleSave = () => {
        if (polygonCoords.length > 0) {
            sendGeometry(polygonCoords); // 부모 컴포넌트로 좌표 전송
            currentPolygon.setMap(null); // 현재 그려진 폴리곤 지도에서 제거
            setPolygonCoords([]); // 폴리곤 좌표 초기화
            setCurrentPolygon(null);
            setIsDrawingEnabled(false);
            setContextMenuVisible(false);
        } else {
            console.log("저장할 좌표가 없습니다.");
        }
    };

    // 다시 그리기
    const handleReset = () => {
        if (currentPolygon) {
            currentPolygon.setMap(null); // 기존 폴리곤 제거
        }
        setPolygonCoords([]); // 폴리곤 좌표 초기화
        setCurrentPolygon(null); // 현재 폴리곤 초기화
        setIsDrawingEnabled(true); // 그리기 활성화
        setContextMenuVisible(false); // 컨텍스트 메뉴 숨기기
    };

    return (
        <>
            <div id="map" style={{ width: "600px", height: "500px" }}></div>
            {contextMenuVisible && (
                <div
                    style={{
                        position: "absolute",
                        top: `${contextMenuPosition.y}px`,
                        left: `${contextMenuPosition.x}px`,
                        background: "#fff",
                        padding: "10px",
                        border: "2px solid #333",
                        zIndex: "1000",
                    }}
                >
                    <button onClick={handleSave}>저장</button>
                    <button onClick={handleReset}>다시 그리기</button>
                </div>
            )}
        </>
    );
}

export default MapComponent;
