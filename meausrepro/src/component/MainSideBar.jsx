import {useContext, useEffect, useState} from "react";
import UserContext from "../context/UserContext.jsx";
import axios from "axios";

function MainSideBar(props) {
    const { user } = useContext(UserContext);
    const { enableDrawing, openSectionModal, handleProjectClick } = props;

    // 프로젝트 선택
    const [isSelectProject, setIsSelectProject] = useState(null);
    // 특정 프로젝트 구간
    const [sectionList, setSectionList] = useState([]);

    // 진행 중인 프로젝트
    const [projectList, setProjectList] = useState([]);
    // 진행 중인 프로젝트
    useEffect(() => {
        axios.get(`http://localhost:8080/MeausrePro/Project/inProgress/${user.id}`)
            .then(res => {
                console.log(res);
                const { data } = res;
                setProjectList(data);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    // 프로젝트 클릭 시,
    const handleSelectProject = (project) => {
        handleProjectClick(project);
        setIsSelectProject(project);
        handleSectionList(project.idx);
    }

    // 구간생성에서 뒤로 가기
    const handleBack = () => {
        setIsSelectProject(null);
    }
    // 특정 프로젝트 구간 보기
    const handleSectionList = (projectId) => {
        axios.get(`http://localhost:8080/MeausrePro/Section/${projectId}`)
            .then(res=> {
                console.log(res);
                const { data } = res;
                setSectionList(data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div className={'sideBar'}>
            {isSelectProject ? (
                <div className={'d-flex flex-column'}>
                    <button type={'button'}
                            className={'btn btn-close'}
                            onClick={handleBack}
                    />
                    <span>{user.name}</span>
                    <hr/>
                    <div key={isSelectProject.idx} className={'d-flex flex-column gap-1'}>
                        <span>{isSelectProject.siteName}</span>
                        <span>주소: {isSelectProject.siteAddress}</span>
                        <span>시작일자: {isSelectProject.startDate}</span>
                        <span>종료일자: {isSelectProject.endDate}</span>
                        <span>시공사: {isSelectProject.contractor}</span>
                        <span>계측사: {isSelectProject.measurer}</span>
                    </div>
                    <hr/>
                    <ul className={'nav nav-pills flex-column mb-auto'}>
                        {sectionList.map(item => {
                            return (
                                <li key={item.idx}>
                                    <button className={'nav-link link-dark'}>
                                        {item.sectionName}
                                    </button>
                                </li>
                            )
                        })}
                        <li>
                            <button className={'nav-link link-dark'} type={'button'} onClick={openSectionModal}>
                                구간 생성
                            </button>
                        </li>
                    </ul>
                </div>
            ) : (
                <div className={'d-flex flex-column'}>
                    <span>{user.name}</span>
                    <hr/>
                    <span>
                    진행 중인 프로젝트
                </span>
                    <ul className={'nav nav-pills flex-column mb-auto'}>
                        {projectList.map(item => {
                            return (
                                <li key={item.idx}>
                                    <button className={'nav-link link-dark'}
                                            onClick={() => handleSelectProject(item)}>
                                        {item.siteName}
                                    </button>
                                </li>
                            )
                        })}
                        <li>
                            <button className={'nav-link link-dark'} type={'button'} onClick={enableDrawing}>
                                프로젝트 생성
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default MainSideBar;