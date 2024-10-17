import {useContext, useEffect, useState} from "react";
import UserContext from "../../context/UserContext.jsx";
import axios from "axios";
import SectionDetailSideBar from "./SectionDetailSideBar.jsx";
import Swal from "sweetalert2";
import InsDetailSideBar from "./InsDetailSideBar.jsx";

function MainSideBar(props) {
    const {user} = useContext(UserContext);
    const {
        enableDrawing,
        openSectionModal,
        handleProjectClick,
        projectBtnText,
        projectList,
        moveToPolygon,
        deleteProject,
        openEditModal,
        sectionList, // Main에서 전달받은 sectionList 사용
        setSectionList, // Main에서 전달받은 setSectionList 사용
        handleSectionList,
        enableDrawingMarkers,
        instrumentBtnText,
        onInstrumentCreated, // Main으로부터 받은 함수
        instrumentList,  // Main에서 전달된 계측기 리스트 사용
        handleInstrumentList, // Main에서 전달된 함수 사용
        setInstrumentList
    } = props;

    const [isSelectProject, setIsSelectProject] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null); // 선택된 구간 정보
    const [selectedInstrument, setSelectedInstrument] = useState(null);  // 선택된 계측기 정보 저장

    // 프로젝트 선택 및 폴리곤 이동
    const handleSelectProject = (project) => {
        if (moveToPolygon) {
            moveToPolygon(project.geometry);
        }
        handleProjectClick(project);
        setIsSelectProject(project);
        handleSectionList(project.idx);
        setSelectedSection(null);
    };

    // 선택된 구간 정보 저장 및 세부 정보 가져오기
    const handleSelectSection = (section) => {
        if (selectedSection?.idx === section.idx) {
            setSelectedSection(null); // 동일한 구간 클릭 시 닫기
        } else {
            setSelectedSection(section); // 선택된 구간 정보 저장
            setSelectedInstrument(null); // 계측기 상세 정보 초기화 (닫기
            handleInstrumentList(section.idx);
        }
        console.log("선택된 구간 ID:", section.idx);
    };

    // 구간 업데이트 후 섹션 리스트 다시 가져오기
    const handleSectionUpdated = (updatedSection) => {
        setSelectedSection(updatedSection); // 선택된 구간 정보 업데이트
        if (isSelectProject) {
            setSectionList(prevList => prevList.map(section =>
                section.idx === updatedSection.idx ? updatedSection : section))
        }
    };

    // SectionDetailSideBar 닫기
    const handleClose = () => {
        setSelectedSection(null);
        setSelectedInstrument(null); // 계측기 정보 초기화
    };

    // 프로젝트 삭제
    const handleDelete = () => {
        Swal.fire({
            title: '프로젝트 삭제',
            text: "프로젝트를 삭제하시겠습니까?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProject(isSelectProject.idx); // Main에서 전달된 deleteProject 사용
                setIsSelectProject(null);
            }
        });
    };

    // 프로젝트 상세정보 닫기
    const handleProjectInfoClose = () => {
        handleClose();
        setIsSelectProject(null);
    }

    const deleteSection = (sectionId) => {
        axios.delete(`http://localhost:8080/MeausrePro/Section/delete/${sectionId}`)
            .then(() => {
                alert("구간이 삭제되었습니다.");
                // 삭제 후 구간 목록을 업데이트하여 반영합니다.
                setSectionList(prevList => prevList.filter(section => section.idx !== sectionId));
            })
            .catch(err => {
                console.error("구간 삭제 중 오류 발생:", err);
            });
    };

    // 계측기 선택 시 상세 정보 열기
    const handleSelectInstrument = (instrument) => {
        axios.get(`http://localhost:8080/MeausrePro/Instrument/details/${instrument.idx}`)
            .then(response => {
                if (response.data.length > 0) {
                    const additionalInfo = response.data[0]; // 첫 번째 요소 선택
                    // 추가 정보에서 idx를 제외하고 병합
                    // eslint-disable-next-line no-unused-vars
                    const { idx, ...restAdditionalInfo } = additionalInfo; // idx는 무시
                    const detailedInstrument = { ...instrument, ...restAdditionalInfo }; // idx 제외한 나머지 병합
                    setSelectedInstrument(detailedInstrument); // 상세 정보 설정
                }
            })
            .catch(err => {
                console.error("계측기 상세 정보 조회 중 오류 발생:", err);
            });

        // 구간 상세 정보는 닫고 리스트는 유지
        setSelectedSection(selectedSection); // 구간 리스트는 유지, 상세 정보는 닫힘
    };



    // 계측기 업데이트 후 리스트 다시 가져오기
    const handleInstrumentUpdated = (updatedIns) => {
        setInstrumentList(prevList =>
            prevList.map(ins => ins.idx === updatedIns.idx ? updatedIns : ins)
        );

        // 상태를 즉시 반영하도록 강제 리렌더링을 트리거
        setSelectedInstrument(null);
        setTimeout(() => {
            setSelectedInstrument(updatedIns);
        }, 0);

        // 리스트를 다시 불러와 동기화
        handleInstrumentList(updatedIns.sectionId);
    };

    useEffect(() => {
        if (selectedInstrument) {
            console.log("계측기 정보 업데이트됨:", selectedInstrument);
        }
    }, [selectedInstrument]);


    // 계측기 삭제
    const deleteInstrument = (instrument) => {
        const instrumentIdx = instrument.idx;
        console.log("삭제할 계측기 idx:", instrumentIdx); // 로그 추가
        axios.delete(`http://localhost:8080/MeausrePro/Instrument/delete/${instrumentIdx}`)
            .then((response) => {
                console.log(response.data);
                if (selectedSection){
                    handleInstrumentList(selectedSection.idx);
                }
            })
            .catch((error) => {
                console.error("계측기 삭제 중 오류 발생:", error);
            });
    };

    useEffect(() => {
        if (instrumentList.length > 0) {
            console.log("계측기 목록 업데이트됨:", instrumentList);
        }
    }, [instrumentList]);


    return (
        <div className={'sideBarWrapper'}>
            {isSelectProject ? (
                <div className={'sideBar'}>
                    <div className={'sideBarHeader'}>
                        <span className={'fs-5 fw-bold'}>프로젝트 상세 정보</span>
                        <button type={'button'} className={'sideBarBtn'} onClick={handleProjectInfoClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                 className="bi bi-x" viewBox="0 0 16 16">
                                <path
                                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>
                        </button>
                    </div>
                    <div className={'sideBarHeader'}>
                    <span className={'fw-bold'}>
                        {isSelectProject.siteName}
                    </span>
                        <div className={'d-flex gap-2'}>
                            <button type={'button'} className={'sideBarBtn projectUpdate'}
                                    onClick={() => openEditModal(isSelectProject)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                                     className="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path
                                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fillRule="evenodd"
                                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                </svg>
                            </button>
                            <button type={'button'} className={'sideBarBtn projectDelete'} onClick={handleDelete}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-trash3" viewBox="0 0 16 16">
                                    <path
                                        d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className={'sideBarContent'}>
                        <div className={'d-flex flex-column gap-2'}>
                            {/* 프로젝트 세부 정보 */}
                            <div key={isSelectProject.idx} className={'projectDetail'}>
                                <span className={'text-muted small'}>주소</span>
                                <span>{isSelectProject.siteAddress}</span>
                                <span className={'text-muted small'}>과업기간</span>
                                <span>{isSelectProject.startDate} ~ {isSelectProject.endDate}</span>
                                <span className={'text-muted small'}>시공사</span>
                                <span>{isSelectProject.contractor}</span>
                                <span className={'text-muted small'}>계측사</span>
                                <span>{isSelectProject.measurer}</span>
                            </div>
                            <div className={'sideBarHeader pb-0 pt-3'}>
                                <span className={'fw-bold'}>구간</span>
                            </div>
                            <ul className={'sideBarProjectList'}>
                                {sectionList.map((section) => (
                                    <li key={section.idx}
                                        className={`projectItem ${selectedSection?.idx === section.idx ? 'selected' : ''}`}>
                                        <div className={'projectNameSection'}>
                                            <button type={'button'} className={'d-flex align-items-center gap-2'} onClick={() => handleSelectSection(section)}>
                                                {selectedSection?.idx === section.idx ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"
                                                         fill="currentColor" className="bi bi-caret-up-fill"
                                                         viewBox="0 0 16 16">
                                                        <path
                                                            d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"
                                                         fill="currentColor" className="bi bi-caret-down-fill"
                                                         viewBox="0 0 16 16">
                                                        <path
                                                            d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                                    </svg>
                                                )}
                                                {section.sectionName}
                                            </button>
                                            <button className={'insCreateBtn'} type={'button'}
                                                    onClick={() => enableDrawingMarkers(section)}>
                                                {instrumentBtnText}
                                            </button>
                                        </div>
                                        {selectedSection?.idx === section.idx && (
                                            <ul className={`instrument-list ${selectedSection?.idx === section.idx ? 'open' : ''}`}>
                                                {instrumentList.length > 0 ? (
                                                    instrumentList.map((instrument, index) => (
                                                        instrument && instrument.insName ? (
                                                            <li key={instrument.idx} className={`instrument-item`}
                                                                onClick={() => handleSelectInstrument(instrument)}>
                                                                {instrument.insName}
                                                            </li>
                                                        ) : (
                                                            <li key={index} className="text-muted">계측기 정보가 잘못되었습니다</li>
                                                        )
                                                    ))
                                                ) : (
                                                    <li className="text-muted">계측기 정보가 없습니다</li>
                                                )}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button className={'projectBtn py-2 rounded-3 mx-3'} type={'button'} onClick={openSectionModal}>
                            구간 생성
                        </button>
                    </div>
                </div>
            ) : (
                <div className={'sideBar'}>
                    <div className={'sideBarHeader'}>
                        <span className={'fs-5 fw-bold'}>현장 리스트</span>
                    </div>
                    <div className={'sideBarContent'}>
                        <ul className={'sideBarProjectList'}>
                            {projectList.map((item) => (
                                <li className={'projectItem'} key={item.idx}>
                                    <button className={'projectNameSection'} onClick={() => handleSelectProject(item)}>
                                        {item.siteName}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button className={'projectBtn py-2 rounded-3 mx-3'} type={'button'} onClick={enableDrawing}>
                            {projectBtnText}
                        </button>
                    </div>
                </div>
            )}
            {/* 구간 상세 사이드바 (계측기 선택 시에도 구간 리스트 유지) */}
            {selectedSection && !selectedInstrument && (
                <SectionDetailSideBar
                    section={selectedSection}
                    handleSectionUpdated={handleSectionUpdated}
                    handleClose={handleClose}
                    deleteSection={deleteSection}
                />
            )}

            {/* 계측기 상세 사이드바 (계측기 리스트 유지) */}
            {selectedInstrument && (
                <InsDetailSideBar
                    key={selectedInstrument ? selectedInstrument.idx : Math.random()}
                    instrument={selectedInstrument}
                    onInstrumentCreated={onInstrumentCreated} // 생성 후 처리 함수 전달
                    handleInstrumentUpdated={handleInstrumentUpdated}
                    handleClose={() => setSelectedInstrument(null)} // 계측기 상세 정보 닫기
                    deleteInstrument={deleteInstrument}  // 여기서 전달
                    siteName={isSelectProject.siteName}
                    sectionName={selectedSection.sectionName}
                />
            )}
        </div>
    );
}

export default MainSideBar;