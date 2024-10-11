import CustomSidebar from "../component/sidebar/CustomSidebar.jsx";
import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserSignUpModal from "../component/modal/UserSignUpModal.jsx";
import UserUpdateModal from "../component/modal/UserUpdateModal.jsx";

function UserManagement() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // 회원정보 목록
    const [userList, setUserList] = useState([]);

    // 회원정보 생성 모달창
    const [isUserSignUpModal, setIsUserSignUpModal] = useState(false);
    const openUserSignUpModal = () => setIsUserSignUpModal(true);
    const closeUserSignUpModal = () => setIsUserSignUpModal(false);

    // 회원정보 수정 모달창
    const [isUserUpdateModal, setIsUserUpdateModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null); // 수정할 사용자 정보를 저장하는 상태

    // 회원정보 수정 모달창 열기
    const openUserUpdateModal = (user) => {
        setUserToEdit(user);
        setIsUserUpdateModal(true);
    };

    // 회원정보 수정 모달창 닫기
    const closeUserUpdateModal = () => {
        setIsUserUpdateModal(false);
        setUserToEdit(null); // 닫을 때 선택된 사용자 정보 초기화
    };

    // 로그인 정보 없을 시, 로그인 페이지로 이동
    useEffect(() => {
        if (!user.id) {
            navigate('/');
        }
        selectUser();
    }, [user, navigate]);

    // 회원정보 조회
    const selectUser = () => {
        axios.get(`http://localhost:8080/MeausrePro/User/notTopManager`)
            .then(res => {
                setUserList(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <div className={'d-flex vh-100'}>
            <CustomSidebar topManager={user.topManager} />
            <div className={'flex-grow-1'}>
                <div className={'mainSection d-flex flex-column'}>
                    <div className={'managementSection'}>
                        <span className={'text-center fs-4 fw-bold'}>회원정보관리</span>
                        <div className={'d-flex justify-content-end'}>
                            <button type={'button'}
                                    className={'px-3 py-2 rounded-pill managementBtn'}
                                    onClick={openUserSignUpModal}>
                                신규등록
                            </button>
                        </div>
                        <div className={'p-3 rounded-3 border align-items-start'}>
                            <table className={'table table-hover text-center'} style={{ verticalAlign: 'middle' }}>
                                <thead>
                                <tr>
                                    <th>아이디</th>
                                    <th>이름</th>
                                    <th>그룹</th>
                                    <th>작업</th>
                                    <th>가입일자</th>
                                    <th>수정</th>
                                    <th>삭제</th>
                                </tr>
                                </thead>
                                <tbody>
                                {userList.length === 0 ? (
                                    <tr>
                                        <td colSpan={9}>출력할 내용이 없습니다.</td>
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
                                                <button
                                                    type={'button'}
                                                    className={'projectUpdate sideBarBtn'}
                                                    onClick={() => openUserUpdateModal(item)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                         fill="currentColor" className="bi bi-pencil-square"
                                                         viewBox="0 0 16 16">
                                                        <path
                                                            d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                        <path fillRule="evenodd"
                                                              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                                    </svg>
                                                </button>
                                            </td>
                                            <td>
                                                <button type={'button'} className={'sideBarBtn projectDelete'}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                         fill="currentColor"
                                                         className="bi bi-trash3" viewBox="0 0 16 16">
                                                        <path
                                                            d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                        <UserSignUpModal
                            isOpen={isUserSignUpModal}
                            closeModal={closeUserSignUpModal}
                            selectUser={selectUser}
                        />
                        <UserUpdateModal
                            isOpen={isUserUpdateModal}
                            closeModal={closeUserUpdateModal}
                            selectUser={selectUser}
                            userInfo={userToEdit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserManagement;
