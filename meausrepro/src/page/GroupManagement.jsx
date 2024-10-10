import {useContext, useEffect, useState} from "react";
import axios from "axios";
import CustomSidebar from "../component/CustomSidebar.jsx";
import CompanyModal from "../component/CompanyModal.jsx";
import UserContext from "../context/UserContext.jsx";
import {useNavigate} from "react-router-dom";

function GroupManagement() {
    const {user} = useContext(UserContext);
    const navigate = useNavigate();
    // 작업그룹 목록
    const [companyList, setCompanyList] = useState([]);
    // 회원정보 생성 모달창
    const [isCompanyModal, setIsCompanyModal] = useState(false);
    // 회원정보 생성 모달창 열기
    const openCompanyModal = () => {
        setIsCompanyModal(true);
    }
    // 회원정보 생성 모달창 닫기
    const closeCompanyModal = () => {
        setIsCompanyModal(false);
    }
    // 로그인 정보 없을 시, 로그인 페이지로 이동
    useEffect(() => {
        if (!user.id) {
            // 로그인 정보 없을 시, 로그인 페이지로 리다이렉트
            navigate('/');
        }
        selectCompany();
    }, [user, navigate]);

    // 작업그룹 전체 조회
    const selectCompany = () => {
        axios.get(`http://localhost:8080/MeausrePro/Company/all`)
            .then(res => {
                setCompanyList(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div className={'d-flex vh-100'}>
            <CustomSidebar topManager={user.topManager}/>
            <div className={'flex-grow-1'} style={{backgroundColor: '#f5f5f5'}}>
                <div className={'mainSection-box p-5 d-flex flex-column gap-2'}>
                    <div className={'d-flex flex-column gap-2 p-3 rounded-3 border'}>
                        <span className={'text-center fs-3'}>작업그룹 관리</span>
                        <div className={'d-flex justify-content-start'}>
                            <button type={'button'}
                                    className={'btn greenBtn'} onClick={openCompanyModal}>
                                + 신규등록
                            </button>
                        </div>
                        <table className={'table table-hover text-center'} style={{verticalAlign: 'middle'}}>
                            <thead>
                            <tr>
                                <th>회사명</th>
                                <th>출력 회사명</th>
                                <th>사용여부</th>
                                <th>상세정보</th>
                                <th>삭제</th>
                            </tr>
                            </thead>
                            <tbody>
                            {companyList.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        출력할 내용이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                companyList.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.company}</td>
                                        <td>{item.companyName}</td>
                                        <td>{item.companyIng}</td>
                                        <td>
                                            <button type={'button'} className={'btn greenBtn'}>
                                                수정
                                            </button>
                                        </td>
                                        <td>
                                            <button type={'button'} className={'btn btn-danger opacity-75'}>
                                                삭제
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                        <CompanyModal
                            isOpen={isCompanyModal}
                            closeModal={closeCompanyModal}
                            selectCompany={selectCompany}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupManagement;