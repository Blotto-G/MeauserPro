import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext.jsx";
import { useNavigate } from "react-router";
import MapComponent from "../component/MapComponent.jsx";
import ProjectCreateModal from "../component/ProjectCreateModal.jsx";
import SectionCreateModal from "../component/SectionCreateModal.jsx";
import MainSideBar from "../component/sidebar/MainSideBar.jsx";
import CustomSidebar from "../component/sidebar/CustomSidebar.jsx";
import axios from "axios";
import ProjectEditModal from "../component/ProjectEditModal.jsx";

function Main() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // 폴리곤 이동
    const [moveToPolygon, setMoveToPolygon] = useState(null);

    // 지도 로드 상태 및 키 상태
    const [isMapReady, setIsMapReady] = useState(false);
    const [mapKey, setMapKey] = useState(0); // 맵을 다시 불러오기 위한 키 상태
    const [sideBarKey, setSideBarKey] = useState(0);
    const [geometryData, setGeometryData] = useState('');
    const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [projectList, setProjectList] = useState([]);
    const [isSelectedProject, setIsSelectedProject] = useState(null);
    const [isBtnText, setIsBtnText] = useState('프로젝트 생성');
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 상태 추가
    const [sectionList, setSectionList] = useState([]);


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
    };

    // 구간 생성 완료 시 호출될 함수
    const onSectionCreated = () => {
        if (isSelectedProject) {
            // 선택된 프로젝트의 구간 목록을 다시 가져오기
            axios.get(`http://localhost:8080/MeausrePro/Section/${isSelectedProject.idx}`)
                .then((res) => {
                    setSectionList(res.data); // 구간 목록 업데이트
                })
                .catch(err => {
                    console.error('구간 목록 업데이트 중 오류 발생:', err);
                });
        }
        setIsSectionModalOpen(false); // 모달 닫기
    };

    // 프로젝트 전체 구간 들고오기
    const handleSectionList = (projectId) => {
        axios.get(`http://localhost:8080/MeausrePro/Section/${projectId}`)
            .then((res) => {
                setSectionList(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    };

    // 구간 저장 모달 열기
    const openSectionModal = () => {
        setIsSectionModalOpen(true);
    };

    // 구간 정보 모달 닫기
    const closeSectionModal = () => {
        setIsSectionModalOpen(false);
    };


    const handleProjectClick = (project) => {
        setIsSelectedProject(project);
    };

    // 수정 모달 열기 함수
    const openEditModal = (project) => {
        setIsSelectedProject(project);
        setIsEditModalOpen(true);
    };

    // 수정 모달 닫기 함수
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setIsSelectedProject(null);
    };

    // 수정 완료 시 프로젝트 목록 업데이트
    const onProjectUpdated = () => {
        fetchProjects();
        setIsEditModalOpen(false);
        setSideBarKey(prevKey => prevKey + 1); // 사이드바 리로드
        setMapKey(prevKey => prevKey + 1); // 맵을 다시 로드하여 최신 상태 반영
    };

    // 프로젝트 목록 업데이트 후 선택한 프로젝트 정보 업데이트
    useEffect(() => {
        if (isSelectedProject) {
            const updatedProject = projectList.find(p => p.idx === isSelectedProject.idx);
            if (updatedProject) {
                setIsSelectedProject(updatedProject);
            }
        }
    }, [projectList]);

    // 프로젝트 삭제
    const deleteProject = (projectId) => {
        axios.delete(`http://localhost:8080/MeausrePro/Project/delete/${projectId}`)
            .then(() => {
                alert("프로젝트가 삭제되었습니다.");
                setProjectList(prevList => prevList.filter(project => project.idx !== projectId));
                setMapKey(prevKey => prevKey + 1); // 맵을 다시 로드하여 변경 반영
                setSideBarKey(prevKey => prevKey + 1); // 사이드바 리로드
            })
            .catch(err => {
                console.error("프로젝트 삭제 중 오류 발생:", err);
            });
    };



    return (
        <div className={'d-flex vh-100'}>
            <CustomSidebar topManager={user.topManager} />
            <div className={'flex-grow-1 d-flex'}>
                <MainSideBar
                    key={`${sideBarKey} = ${mapKey}`}
                    enableDrawing={enableDrawing}
                    handleProjectClick={handleProjectClick}
                    openSectionModal={openSectionModal}
                    projectBtnText={isBtnText}
                    projectList={projectList}
                    sectionList={sectionList} // sectionList 전달
                    moveToPolygon={moveToPolygon}
                    setProjectList={setProjectList}
                    setSectionList={setSectionList} // setSectionList 전달
                    handleSectionList={handleSectionList}
                    openEditModal={openEditModal}
                    deleteProject={deleteProject}
                />
                <div className={'flex-grow-1'}>
                    <MapComponent
                        key={mapKey} // key를 이용해 맵 컴포넌트를 다시 로드
                        sendGeometry={handleGeometryData}
                        isDrawingEnabled={isDrawingEnabled}
                        setIsDrawingEnabled={setIsDrawingEnabled}
                        isModalOpen={isProjectModalOpen}
                        setIsMapReady={setIsMapReady}
                        setMoveToPolygon={setMoveToPolygon}
                    />
                    <ProjectCreateModal
                        geometryData={geometryData}
                        isOpen={isProjectModalOpen}
                        closeModal={closeProjectModal}
                        onProjectCreated={onProjectCreated}
                    />
                    <ProjectEditModal
                        projectData={isSelectedProject}
                        isOpen={isEditModalOpen}
                        closeModal={closeEditModal}
                        onProjectUpdated={onProjectUpdated}/>
                    <SectionCreateModal
                        project={isSelectedProject}
                        isOpen={isSectionModalOpen}
                        closeModal={closeSectionModal}
                        onSectionCreated={onSectionCreated} // 구간 생성 후 호출될 함수 전달
                    />
                </div>
            </div>
        </div>
    );
}

export default Main;
