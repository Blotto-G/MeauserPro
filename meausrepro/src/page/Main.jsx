import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext.jsx";
import { useNavigate } from "react-router";
import MapComponent from "../component/MapComponent.jsx";
import ProjectCreateModal from "../component/ProjectCreateModal.jsx";
import SectionCreateModal from "../component/SectionCreateModal.jsx";
import MainSideBar from "../component/sidebar/MainSideBar.jsx";
import CustomSidebar from "../component/sidebar/CustomSidebar.jsx";
import axios from "axios";

function Main() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // 지도 로드 상태 및 키 상태
    const [isMapReady, setIsMapReady] = useState(false);
    const [mapKey, setMapKey] = useState(0); // 맵을 다시 불러오기 위한 키 상태
    const [geometryData, setGeometryData] = useState('');
    const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [projectList, setProjectList] = useState([]);
    const [isSelectedProject, setIsSelectedProject] = useState(null);
    const [isBtnText, setIsBtnText] = useState('프로젝트 생성');
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

    // 로그인 정보 없을 시, 로그인 페이지로 이동
    useEffect(() => {
        if (!user || !user.id) {
            navigate('/');
        }
        fetchProjects();
    }, [user, navigate]);

    const fetchProjects = () => {
        axios.get(`http://localhost:8080/MeausrePro/Project/inProgress/${encodeURIComponent(user.id)}/${user.topManager}`)
            .then(res => {
                setProjectList(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const handleGeometryData = (coordinates) => {
        setGeometryData(coordinates);
        setIsProjectModalOpen(true);
    };

    const enableDrawing = () => {
        if (isDrawingEnabled) {
            setIsDrawingEnabled(false);
            setIsBtnText('프로젝트 생성');
            // 맵 컴포넌트를 다시 불러오기 위해 key 값을 업데이트
            setMapKey(prevKey => prevKey + 1);
        } else {
            setIsDrawingEnabled(true);
            setIsBtnText('프로젝트 생성 취소');
        }
    };

    const closeProjectModal = () => {
        setIsProjectModalOpen(false);
    };

    const onProjectCreated = () => {
        fetchProjects();
        setIsDrawingEnabled(false);
        setIsBtnText('프로젝트 생성');
        setIsProjectModalOpen(false);
        setMapKey(prevKey => prevKey + 1); // 프로젝트 생성 후에도 맵을 다시 로드
    };

    const openSectionModal = () => {
        setIsSectionModalOpen(true);
    };

    const closeSectionModal = () => {
        setIsSectionModalOpen(false);
    };

    const handleProjectClick = (project) => {
        setIsSelectedProject(project);
    };

    return (
        <div className={'d-flex vh-100'}>
            <CustomSidebar topManager={user.topManager} />
            <div className={'flex-grow-1 d-flex'}>
                <MainSideBar
                    enableDrawing={enableDrawing}
                    handleProjectClick={handleProjectClick}
                    openSectionModal={openSectionModal}
                    projectBtnText={isBtnText}
                    projectList={projectList}
                />
                <div className={'flex-grow-1'}>
                    <MapComponent
                        key={mapKey} // key를 이용해 맵 컴포넌트를 다시 로드
                        sendGeometry={handleGeometryData}
                        isDrawingEnabled={isDrawingEnabled}
                        setIsDrawingEnabled={setIsDrawingEnabled}
                        isModalOpen={isProjectModalOpen}
                        setIsMapReady={setIsMapReady}
                    />
                    <ProjectCreateModal
                        geometryData={geometryData}
                        isOpen={isProjectModalOpen}
                        closeModal={closeProjectModal}
                        onProjectCreated={onProjectCreated}
                    />
                    <SectionCreateModal
                        project={isSelectedProject}
                        isOpen={isSectionModalOpen}
                        closeModal={closeSectionModal}
                    />
                </div>
            </div>
        </div>
    );
}

export default Main;
