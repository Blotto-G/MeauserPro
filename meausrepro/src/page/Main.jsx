import {useContext, useEffect, useState} from "react";
import UserContext from "../context/UserContext.jsx";
import {useNavigate} from "react-router";
import MapComponent from "../component/MapComponent.jsx";
import ProjectCreateModal from "../component/ProjectCreateModal.jsx";
import SectionCreateModal from "../component/SectionCreateModal.jsx";
import MainSideBar from "../component/MainSideBar.jsx";
import NavBar from "../component/NavBar.jsx";
import Header from "../layout/Header.jsx";

function Main() {
    const {user} = useContext(UserContext);
    const navigate = useNavigate();

    // 좌표 저장
    const [geometryData, setGeometryData] = useState('');
    // 폴리곤 생성
    const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
    // 프로젝트 생성 모달
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    // 프로젝트 선택 시, 프로젝트 정보 보여주기
    const [isSelectedProject, setIsSelectedProject] = useState(null);

    // 구간 생성 모달
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

    useEffect(() => {
        if (!user.id) {
            // 로그인 정보 없을 시, 로그인 페이지로 리다이렉트
            navigate('/');
        }
    }, [user, navigate]);

    // 좌표 데이터 받는 함수
    // 프로젝트 생성 모달
    const handleGeometryData = (coordinates) => {
        setGeometryData(coordinates);
        setIsProjectModalOpen(true);
        console.log(coordinates);
    }

    // 프로젝트 생성 버튼 클릭 시 폴리곤 생성 모드 활성화
    const enableDrawing = () => {
        setIsDrawingEnabled(true);
    }

    // 프로젝트 생성 모달 닫기
    const closeProjectModal = () => {
        setIsProjectModalOpen(false);
    }
    // 구간 생성 모달 열기
    const openSectionModal = () => {
        setIsSectionModalOpen(true);
    }
    // 구간 생성 모달 닫기
    const closeSectionModal = () => {
        setIsSectionModalOpen(false);
    }

    // 프로젝트 선택 시 해당 프로젝트 정보 표시
    const handleProjectClick = (project) => {
        setIsSelectedProject(project);
    }
    return (
        <div>
            <header>
                <Header />
            </header>
            <div className={'d-flex p-0 mx-0 my-5'}>
                <NavBar />
                <div style={{marginTop: '8px'}}>
                    <MainSideBar
                        enableDrawing = {enableDrawing}
                        handleProjectClick = {handleProjectClick}
                        openSectionModal = {openSectionModal} />
                    <div className={'mainSection'}>
                        <MapComponent
                            sendGeometry = {handleGeometryData}
                            isDrawingEnabled = {isDrawingEnabled}
                            setIsDrawingEnabled = {setIsDrawingEnabled} />
                        <ProjectCreateModal
                            geometryData = {geometryData}
                            isOpen = {isProjectModalOpen}
                            closeModal = {closeProjectModal} />
                        <SectionCreateModal
                            project = {isSelectedProject}
                            isOpen = {isSectionModalOpen}
                            closeModal = {closeSectionModal} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main;
