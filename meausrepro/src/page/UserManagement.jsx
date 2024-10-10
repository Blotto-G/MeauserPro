import Header from "../layout/Header.jsx";
import NavBar from "../component/NavBar.jsx";
import {useContext, useEffect, useState} from "react";
import UserContext from "../context/UserContext.jsx";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import UserSignUpModal from "../component/UserSignUpModal.jsx";
import CompanyModal from "../component/CompanyModal.jsx";

function UserManagement() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // 회원정보 목록
    const [userList, setUserList] = useState([]);
    // 작업그룹 목록
    const [companyList, setCompanyList] = useState([]);

    // 회원정보 생성 모달창
    const [isUserSignUpModal, setIsUserSignUpModal] = useState(false);
    // 회원정보 생성 모달창 열기
    const openUserSignUpModal = () => {
        setIsUserSignUpModal(true);
    }
    // 회원정보 생성 모달창 닫기
    const closeUserSignUpModal = () => {
        setIsUserSignUpModal(false);
    }

    // 작업그룹 생성 모달창
    const [isCompanyModal, setIsCompanyModal] = useState(false);
    // 작업그룹 생성 모달창 열기
    const openCompanyModal = () => {
        setIsCompanyModal(true);
    }
    // 작업그룹 생성 모달창 닫기
    const closeCompanyModal = () => {
        setIsCompanyModal(false);
    }
    // 로그인 정보 없을 시, 로그인 페이지로 이동
    useEffect(() => {
        if (!user.id) {
            // 로그인 정보 없을 시, 로그인 페이지로 리다이렉트
            navigate('/');
        }
        selectUser();
        selectCompany();
    }, [user, navigate]);

    // 회원정보 조회
    const selectUser = () => {
        axios.get(`http://localhost:8080/MeausrePro/User/notTopManager`)
            .then(res => {
                console.log(res.data);
                setUserList(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }
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
        <div>
            <header>
                <Header />
            </header>
            <div className={'container-fluid d-flex p-0 mx-0 my-5'}>
                <NavBar topManager={user.topManager} />
                <div className={'mainSection p-5 d-flex flex-column gap-2 w-100'}>
                    <div className={'d-flex flex-column gap-2 p-3 rounded-3 border'}>
                        <span>회원정보관리</span>
                        <div className={'d-flex justify-content-start'}>
                            <button type={'button'}
                                    className={'btn greenBtn'} onClick={openUserSignUpModal}>
                                신규등록
                            </button>
                        </div>
                        <table className={'table table-hover text-center'}>
                            <thead>
                            <tr>
                                <th>아이디</th>
                                <th>이름</th>
                                <th>그룹</th>
                                <th>작업</th>
                                <th>가입일자</th>
                                <th>정보</th>
                                <th>삭제</th>
                            </tr>
                            </thead>
                            <tbody>
                            {userList.length === 0 ? (
                                <tr>
                                    <td colSpan={9}>
                                        출력할 내용이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                userList.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.companyIdx ? item.companyIdx.companyName : ''}</td>
                                        <td>{item.role === '0' ? '관리 (웹)' : '현장'}</td>
                                        <td>{item.createDate}</td>
                                        <td>
                                            <button type={'button'} className={'btn greenBtn'}>
                                                수정
                                            </button>
                                        </td>
                                        <td>
                                            <button type={'button'} className={'btn btn-danger'}>
                                                삭제
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}

                            </tbody>
                        </table>
                        <UserSignUpModal isOpen={isUserSignUpModal}
                                         closeModal={closeUserSignUpModal}
                                         selectUser={selectUser}/>
                    </div>
                    <div className={'d-flex flex-column gap-2 p-3 rounded-3 border'}>
                        <span>작업그룹 관리</span>
                        <div className={'d-flex justify-content-start'}>
                            <button type={'button'}
                                    className={'btn greenBtn'} onClick={openCompanyModal}>
                                신규등록
                            </button>
                        </div>
                        <table className={'table table-hover text-center'}>
                            <thead>
                            <tr>
                                <th>회사명</th>
                                <th>출력 회사명</th>
                                <th>사용여부</th>
                                <th>정보</th>
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
                                            <button type={'button'} className={'btn btn-danger'}>
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
                            selectCompany = {selectCompany}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserManagement;