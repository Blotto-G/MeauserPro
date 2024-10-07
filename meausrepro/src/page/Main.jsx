import {useContext, useEffect, useState} from "react";
import UserContext from "../context/UserContext.jsx";
import {useNavigate} from "react-router";
import MapComponent from "../component/MapComponent.jsx";
import ProjectCreateModal from "../component/ProjectCreateModal.jsx";
import Sidebar from "../component/Sidebar.jsx";

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
        <div className={'d-flex'}>
            <Sidebar />
            <div className={'sideBar'} style={{position: 'relative', height:'100vh', width: '250px'}}>
                <span>{user.name}</span>
                <hr/>
                {/*<ul className={'nav nav-pills flex-column'}>*/}
                {/*    <li>*/}
                        <button className={'btn btn-outline-dark'} type={'button'} onClick={enableDrawing}
                        style={{position:'absolute',bottom: '50px', width: '100%', left: '0', right: '0'}}>
                            프로젝트 생성
                        </button>
                    {/*</li>*/}
                {/*</ul>*/}
            </div>
            <div className={'mainSection'}>
                <MapComponent sendGeometry={handleGeometryData} isDrawingEnabled={isDrawingEnabled} setIsDrawingEnabled = {setIsDrawingEnabled} />
                <ProjectCreateModal geometryData={geometryData} isOpen={isModalOpen} closeModal={closeModal} />
            </div>
        </div>
    )
}

export default Main;
