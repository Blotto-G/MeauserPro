import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext.jsx";
import { useNavigate } from "react-router";
import MapComponent from "../component/MapComponent.jsx";
import ProjectCreateModal from "../component/modal/ProjectCreateModal.jsx";
import SectionCreateModal from "../component/modal/SectionCreateModal.jsx";
import MainSideBar from "../component/sidebar/MainSideBar.jsx";
import CustomSidebar from "../component/sidebar/CustomSidebar.jsx";
import axios from "axios";
import ProjectEditModal from "../component/modal/ProjectEditModal.jsx";
import InstrumentCreateModal from "../component/modal/InstrumentCreateModal.jsx";

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

    const [isInstrumentModalOpen, setIsInstrumentModalOpen] = useState(false); // 계측기 생성 모달
    const [insGeometryData, setInsGeometryData] = useState(''); // 계측기 좌표 저장
    const [isDrawingEnabledMarker, setIsDrawingEnabledMarker] = useState(false); // 마커 생성
    const [isInsBtnText, setIsInsBtnText] = useState('계측기 추가'); // 계측기 추가 버튼 텍스트 관리
    const [isSelectedSection, setIsSelectedSection] = useState(null);
    const [instrumentList, setInstrumentList] = useState([]);


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
        setMapKey(prevKey => prevKey + 1);
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

    // 구간 목록 업데이트 후 선택한 구간 정보 업데이트
    useEffect(() => {
        if (isSelectedSection) {
            const updatedSection = sectionList.find(s => s.idx === isSelectedSection.idx);
            if (updatedSection) {
                setIsSelectedSection(updatedSection);
            }
        }
    }, [sectionList]);

    // 계측기 좌표 데이터 받는 함수
    const handelInsGeometryData = (insCoordinates) => {
        setInsGeometryData(insCoordinates);
        setIsInstrumentModalOpen(true);
        console.log(insCoordinates);
    };

    // 계측기 추가 버튼 클릭 시 마커 생성 모드 활성화 및 취소
    const enableDrawingMarkers = (section) => {
        if (isDrawingEnabledMarker) {
            setIsDrawingEnabledMarker(false);
            setIsInsBtnText('계측기 추가')
            handleSectionClick(section);
            handleInstrumentList(section.idx);
        } else {
            setIsDrawingEnabledMarker(true);
            setIsInsBtnText('계측기 추가')
            handleSectionClick(section);
            handleInstrumentList(section.idx);
        }
    };

    // 계측기 생성 모달 닫기
    const closeInstrumentModal = () => {
        setIsInstrumentModalOpen(false);
    };

    const handleSectionClick = (section) => {
        setIsSelectedSection(section);
    };

    // 프로젝트 전체 계측기 들고오기
    const handleInstrumentList = (projectId) => {
        axios.get(`http://localhost:8080/MeausrePro/Instrument/${projectId}`)
            .then((res) => {
                setInstrumentList(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    };

    // 계측기 생성 완료 시 호출될 함수
    const onInstrumentCreated = () => {
        if (isSelectedProject) {
            handleInstrumentList(isSelectedProject.idx);
        }
        setIsInstrumentModalOpen(false); // 모달 닫기
    };

    // useEffect로 프로젝트 선택 시 자동으로 계측기 목록 가져오기
    useEffect(() => {
        if (isSelectedProject) {
            handleInstrumentList(isSelectedProject.idx);
        }
    }, [isSelectedProject]); // isSelectedProject 상태가 변경될 때 실행

    // 수진님꺼 추가
    // // 계측기 리스트를 불러오는 코드
    // const handleInstrumentList = (sectionId) => {
    //     axios.get(`http://localhost:8080/MeausrePro/Instrument/section/${sectionId}`)
    //         .then((res) => {
    //             setInstrumentList(res.data);  // 계측기 리스트 업데이트
    //         })
    //         .catch((err) => {
    //             console.log("계측기 리스트 불러오기 중 오류 발생:", err);
    //         });
    // };
    //
    // const onInstrumentCreated = (newInstrument) => {
    //     if (newInstrument && newInstrument.idx) {
    //         console.log("새로 생성된 계측기:", newInstrument);
    //         setInstrumentList((prevList) => [...prevList, newInstrument]); // 기존 목록에 새 계측기 추가
    //     } else {
    //         console.error("계측기 정보가 잘못되었습니다:", newInstrument);
    //     }
    // };

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
                    instrumentList={instrumentList} // instrumentList 전달
                    moveToPolygon={moveToPolygon}
                    setProjectList={setProjectList}
                    setSectionList={setSectionList} // setSectionList 전달
                    setInstrumentList={setInstrumentList} // setInstrumentList 전달
                    handleSectionList={handleSectionList}
                    handleInstrumentList={handleInstrumentList}
                    openEditModal={openEditModal}
                    deleteProject={deleteProject}
                    handleSectionClick={handleSectionClick}
                    enableDrawingMarkers={enableDrawingMarkers} // 계측기 마커
                    instrumentBtnText={isInsBtnText} // 계측기 추가 버튼

                    // 수진님꺼 추가
                    // onInstrumentCreated={onInstrumentCreated}
                    // instrumentList={instrumentList} // 상태 전달
                    // handleInstrumentList={handleInstrumentList} // 함수 전달
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
                        sendInsGeometry={handelInsGeometryData} // 계측기 지오매트리 정보
                        isDrawingEnabledMarker={isDrawingEnabledMarker} // 마커 생성 활성화
                        setIsDrawingEnabledMarker={setIsDrawingEnabledMarker} // 마커 생성
                        isInsModalOpen={isInstrumentModalOpen} // 계측기 모달창 열기
                        projectData={isSelectedProject}
                        sectionData={isSelectedSection}
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
                    <InstrumentCreateModal
                        insGeometryData={insGeometryData} // 계측기 좌표
                        projectData={isSelectedProject}
                        section={isSelectedSection}
                        isOpen={isInstrumentModalOpen}
                        closeModal={closeInstrumentModal}
                        onInstrumentCreated={onInstrumentCreated} // 계측기 생성 후 호출될 함수 전달
                        instrumentList={instrumentList}
                    />
                </div>
            </div>
        </div>
    );
}

export default Main;
