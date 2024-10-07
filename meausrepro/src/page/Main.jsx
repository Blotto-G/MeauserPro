import {useContext, useEffect, useState} from "react";
import UserContext from "../context/UserContext.jsx";
import {useNavigate} from "react-router";
import MapComponent from "../component/MapComponent.jsx";
import ProjectCreateModal from "../component/ProjectCreateModal.jsx";
import Sidebar from "../component/Sidebar.jsx";
import Navbar from "../component/Navbar.jsx";

function Main() {
    const {user} = useContext(UserContext);
    const navigate = useNavigate();

    // 좌표 저장
    const [geometryData, setGeometryData] = useState('');
    // 폴리곤 생성
    const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
    // 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!user.id) {
            // 로그인 정보 없을 시, 로그인 페이지로 리다이렉트
            navigate('/');
        }
    }, [user, navigate]);

    // 좌표 데이터 받는 함수
    const handleGeometryData = (coordinates) => {
        setGeometryData(coordinates);
        setIsModalOpen(true);
        console.log(coordinates);
    }

    // 프로젝트 생성 버튼 클릭 시 폴리곤 생성 모드 활성화
    const enableDrawing = () => {
        setIsDrawingEnabled(true);
    }

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className={'d-flex'} style={{ flexGrow: 1, overflow: 'hidden' }}>
                <Sidebar />
                <div className={'sideBar'} style={{position: 'relative', height: '100%', width: '250px',
                display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
                    <span>계측관리시스템 / 메인 {user.name}</span>
                    <hr/>
                    <p className={"mt-4"}>공사현장 검색</p>
                    <form className={"d-flex"}>
                        <input className={"form-control me-2"} type="search"/>
                        <button className={"btn btn-outline-success"} type="submit">Search</button>
                    </form>
                    <div>
                        <p className={"mt-3"}>현장 리스트</p>
                        <ul className={"list-group mt-2"}>
                            <li className={"list-group-item"}></li>
                        </ul>
                    </div>
                    <button className={'btn btn-outline-dark'} type={'button'} onClick={enableDrawing}
                            style={{position: 'sticky', bottom: '0px', width: '100%', left: '0', right: '0',
                            marginTop: 'auto'}}>
                        프로젝트 생성
                    </button>
                    {/*</li>*/}
                    {/*</ul>*/}
                </div>
                <div className={'mainSection'} style={{ flexGrow: 1, overflow: 'auto', height: '100%' }}>
                    <MapComponent sendGeometry={handleGeometryData} isDrawingEnabled={isDrawingEnabled}
                                  setIsDrawingEnabled={setIsDrawingEnabled}/>
                    <ProjectCreateModal geometryData={geometryData} isOpen={isModalOpen} closeModal={closeModal} />
                </div>
            </div>
        </div>
    )
}

export default Main;
