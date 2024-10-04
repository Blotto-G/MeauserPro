import {useContext, useEffect, useState} from "react";
import UserContext from "../context/UserContext.jsx";
import {useNavigate} from "react-router";
import MapComponent from "../component/MapComponent.jsx";
import ProjectCreateModal from "../component/ProjectCreateModal.jsx";
import axios from "axios";

function Main() {
    const {user} = useContext(UserContext);
    const [projectList, setProjectList] = useState([]);
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
        <div className={'container-fluid p-3'}>
            <div className={'sideBar'}>
                <span>{user.name}</span>
                <hr/>
                <ul className={'nav nav-pills flex-column mb-auto'}>
                    {projectList.map(item => {
                        return (
                            <li key={item.idx} className={'nav-link link-dark'}>
                                <span>{item.siteName}</span>
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
            <div className={'mainSection'}>
                <MapComponent sendGeometry={handleGeometryData} isDrawingEnabled = {isDrawingEnabled} setIsDrawingEnabled = {setIsDrawingEnabled} />
                <ProjectCreateModal geometryData={geometryData} isOpen={isModalOpen} closeModal={closeModal} />
            </div>
        </div>
    )
}

export default Main;
