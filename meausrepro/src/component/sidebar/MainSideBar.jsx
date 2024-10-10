import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext.jsx";
import axios from "axios";
import SectionDetailSideBar from "./SectionDetailSideBar.jsx";

function MainSideBar(props) {
    const { user } = useContext(UserContext);
    const { enableDrawing, openSectionModal, handleProjectClick, projectBtnText, projectList } = props;

    const [isSelectProject, setIsSelectProject] = useState(null);
    const [sectionList, setSectionList] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null); // 선택된 구간 정보

    // 프로젝트 선택
    const handleSelectProject = (project) => {
        handleProjectClick(project);
        setIsSelectProject(project);
        handleSectionList(project.idx);
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

    // 선택된 구간 정보 저장 및 세부 정보 가져오기
    const handleSelectSection = (section) => {
        setSelectedSection(section); // 선택된 구간 정보 저장
    };

    // 구간 업데이트 후 섹션 리스트 다시 가져오기
    const handleSectionUpdated = (updatedSection) => {
        setSelectedSection(updatedSection); // 선택된 구간 정보 업데이트
        handleSectionList(isSelectProject.idx); // 프로젝트의 전체 구간 리스트 다시 가져오기
    };

    // SectionDetailSideBar 닫기
    const handleClose = () => {
        setSelectedSection(null);
    };

    return (
        <div className={'sideBarWrapper'}>
            {isSelectProject ? (
                <div className={'sideBar'}>
                    <div className={'sideBarHeader'}>
                        <span className={'fs-5 fw-bold'}>프로젝트 상세 정보</span>
                        <button type={'button'}
                                className={'sideBarBtn'} onClick={() => setIsSelectProject(null)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                 className="bi bi-x" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>
                        </button>
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
                                {sectionList.map((item) => (
                                    <li key={item.idx} className={`projectItem ${selectedSection?.idx === item.idx ? 'selected' : ''}`}>
                                        <button
                                            type={'button'}
                                            onClick={() => handleSelectSection(item)}
                                        >
                                            {item.sectionName}
                                        </button>
                                    </li>
                                ))}
                            </ul>
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
                />
            )}
        </div>
    );
}

export default MainSideBar;