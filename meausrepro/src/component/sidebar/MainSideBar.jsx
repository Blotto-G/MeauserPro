import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext.jsx";
import axios from "axios";
import SectionDetailSideBar from "./SectionDetailSideBar.jsx";
import Swal from "sweetalert2";

function MainSideBar(props) {
    const { user } = useContext(UserContext);
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
        handleSectionClick,

        // 수진님꺼 추가
        // onInstrumentCreated, // Main으로부터 받은 함수
        // instrumentList,  // Main에서 전달된 계측기 리스트 사용
        // handleInstrumentList, // Main에서 전달된 함수 사용
    } = props;

    const [isSelectProject, setIsSelectProject] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null); // 선택된 구간 정보
    const [selectedInstrument, setSelectedInstrument] = useState(null);  // 선택된 계측기 정보 저장

    // 특정 구간 계측기
    const [instrumentList, setInstrumentList] = useState([]);

    // 프로젝트 선택 및 폴리곤 이동
    const handleSelectProject = (project) => {
        if (moveToPolygon) {
            moveToPolygon(project.geometry);
        }
        handleProjectClick(project);
        setIsSelectProject(project);
        handleSectionList(project.idx);
    };

    // 선택된 구간 정보 저장 및 세부 정보 가져오기
    const handleSelectSection = (section) => {
        handleSectionClick(section);
        setSelectedSection(section); // 선택된 구간 정보 저장
        handleInstrumentList(section.idx);
    };

    // 구간 업데이트 후 섹션 리스트 다시 가져오기
    const handleSectionUpdated = (updatedSection) => {
        setSelectedSection(updatedSection); // 선택된 구간 정보 업데이트
        if (isSelectProject) {
            // 선택된 프로젝트의 구간 목록을 다시 가져오기 위해 Main의 함수 사용
            setSectionList(prev => [...prev]); // 단순히 리스트를 리셋해서 다시 렌더링하게 함
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
        console.log(`삭제할 구간 ID: ${sectionId}`); // 확인용 로그
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


    // 특정 구간 계측기 보기
    const handleInstrumentList = (sectionId) => {
        axios.get(`http://localhost:8080/MeausrePro/Instrument/${sectionId}`)
            .then(res=> {
                console.log(res);
                const { data } = res;
                setInstrumentList(data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    // 수진님꺼 추가
    // // 계측기 선택 시 상세 정보 열기
    // const handleSelectInstrument = (instrument) => {
    //     setSelectedInstrument(instrument); // 계측기 상세 정보 열기
    //     // 구간 상세 정보는 닫고 리스트는 유지
    //     setSelectedSection(selectedSection); // 구간 리스트는 유지, 상세 정보는 닫힘
    // };
    //
    // // 계측기 삭제
    // const deleteInstrument = (idx) => {
    //     axios.delete(`http://localhost:8080/MeausrePro/Instrument/delete/${idx}`)
    //         .then((res) => {
    //             console.log('계측기 삭제 성공:', res.data);
    //             setInstrumentList(prevList => prevList.filter(instrument => instrument.idx !== idx))
    //         })
    //         .catch((err) => {
    //             console.error('계측기 삭제 중 오류 발생:', err);
    //         });
    // };
    //
    // useEffect(() => {
    //     if (instrumentList.length > 0) {
    //         console.log("계측기 목록 업데이트됨:", instrumentList);
    //     }
    // }, [instrumentList]);

    return (
        <div className={'sideBarWrapper'}>
            {isSelectProject ? (
                <div className={'sideBar'}>
                    <div className={'sideBarHeader'}>
                        <span className={'fs-5 fw-bold'}>프로젝트 상세 정보</span>
                        <button type={'button'}
                                className={'sideBarBtn'} onClick={handleProjectInfoClose}>
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
                            <button type={'button'}
                                    className={'sideBarBtn projectUpdate'}
                                    onClick={() => openEditModal(isSelectProject)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                     fill="currentColor" className="bi bi-pencil-square"
                                     viewBox="0 0 16 16">
                                    <path
                                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fillRule="evenodd"
                                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                </svg>
                            </button>
                            <button type={'button'}
                                    className={'sideBarBtn projectDelete'}
                                    onClick={handleDelete}>
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
                            <div>
                                <ul className={'sideBarProjectList'}>
                                    {sectionList.map((item) => (
                                        <li key={item.idx}
                                            className={`projectItem ${selectedSection?.idx === item.idx ? 'selected' : ''}`}>
                                            <div className={'d-flex justify-content-between'}>
                                                <button
                                                    type={'button'}
                                                    onClick={() => handleSelectSection(item)}
                                                >
                                                    {item.sectionName}
                                                </button>
                                                <button
                                                    className={'projectBtn py-2 rounded-3 mx-3'}
                                                    type={'button'}
                                                    onClick={() => enableDrawingMarkers(item)}>
                                                    {instrumentBtnText}
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                    {/*수진님꺼 추가*/}
                                    {/*{sectionList.map((section) => (*/}
                                    {/*    <li key={section.idx} className={`projectItem ${selectedSection?.idx === section.idx ? 'selected' : ''}`}>*/}
                                    {/*        <div className={'d-flex justify-content-between'}>*/}
                                    {/*            <button type={'button'} onClick={() => handleSelectSection(section)}>*/}
                                    {/*                {section.sectionName}*/}
                                    {/*            </button>*/}
                                    {/*            <button className={'projectBtn py-2 rounded-3 mx-3'} type={'button'} onClick={() => enableDrawingMarkers(section)} style={{fontSize: '12px'}}>*/}
                                    {/*                {instrumentBtnText}*/}
                                    {/*            </button>*/}
                                    {/*        </div>*/}
                                    {/*        /!* 선택된 구간에만 계측기 리스트 보여줌 *!/*/}
                                    {/*        {selectedSection?.idx === section.idx && (*/}
                                    {/*            <ul className={"instrument-list"}>*/}
                                    {/*                {instrumentList.length > 0 ? (*/}
                                    {/*                    instrumentList.map((instrument, index) => (*/}
                                    {/*                        instrument && instrument.insName ? (*/}
                                    {/*                            <li key={instrument.idx} className={`instrument-item`}*/}
                                    {/*                                onClick={() => handleSelectInstrument(instrument)}>*/}
                                    {/*                                {instrument.insName}*/}
                                    {/*                            </li>*/}
                                    {/*                        ) : (*/}
                                    {/*                            <li key={index} className="text-muted">계측기 정보가 잘못되었습니다</li>*/}
                                    {/*                        )*/}
                                    {/*                    ))*/}
                                    {/*                ) : (*/}
                                    {/*                    <li className="text-muted">계측기 정보가 없습니다</li>*/}
                                    {/*                )}*/}
                                    {/*            </ul>*/}
                                    {/*        )}*/}
                                    {/*    </li>*/}
                                    {/*))}*/}
                                    <ul className={"nav nav-pills flex-column mb-auto border border-3 rounded-3"}>
                                        {instrumentList.map((item) => {
                                            return (
                                                <li key={item.idx} className={`mb-2`}>{item.idx}</li>
                                            );
                                        })};
                                    </ul>
                                </ul>
                            </div>
                        </div>
                        <button
                            className={'projectBtn py-2 rounded-3 mx-3'}
                            type={'button'}
                            onClick={openSectionModal}>
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
                                    <button onClick={() => handleSelectProject(item)}>
                                        {item.siteName}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button className={'projectBtn py-2 rounded-3 mx-3'}
                                type={'button'}
                                onClick={enableDrawing}>
                            {projectBtnText}
                        </button>
                    </div>
                </div>
            )}
            {selectedSection && (
                <SectionDetailSideBar
                    section={selectedSection}
                    handleSectionUpdated={handleSectionUpdated}
                    handleClose={handleClose}
                    deleteSection={deleteSection}
                />
            )}
            {/*수진님꺼 추가*/}
            {/*/!* 구간 상세 사이드바 (계측기 선택 시에도 구간 리스트 유지) *!/*/}
            {/*{selectedSection && !selectedInstrument && (*/}
            {/*    <SectionDetailSideBar*/}
            {/*        section={selectedSection}*/}
            {/*        handleSectionUpdated={handleSectionUpdated}*/}
            {/*        handleClose={handleClose}*/}
            {/*        deleteSection={deleteSection}*/}
            {/*    />*/}
            {/*)}*/}
            
            {/*/!* 계측기 상세 사이드바 (계측기 리스트 유지) *!/*/}
            {/*{selectedInstrument && (*/}
            {/*    <InsDetailSideBar*/}
            {/*        instrument={selectedInstrument}*/}
            {/*        onInstrumentCreated={onInstrumentCreated} // 생성 후 처리 함수 전달*/}
            {/*        handleClose={() => setSelectedInstrument(null)} // 계측기 상세 정보 닫기*/}
            {/*        deleteInstrument={deleteInstrument}  // 여기서 전달*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    );
}

export default MainSideBar;