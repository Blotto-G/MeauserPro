import CustomSidebar from "../component/CustomSidebar.jsx";
import {useContext, useEffect, useState} from "react";
import UserContext from "../context/UserContext.jsx";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import UserSignUpModal from "../component/UserSignUpModal.jsx";

function UserManagement() {
    const {user} = useContext(UserContext);
    const navigate = useNavigate();

    // 회원정보 목록
    const [userList, setUserList] = useState([]);

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

    // 로그인 정보 없을 시, 로그인 페이지로 이동
    useEffect(() => {
        if (!user.id) {
            // 로그인 정보 없을 시, 로그인 페이지로 리다이렉트
            navigate('/');
        }
        selectUser();
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
    return (
        <div className={'d-flex vh-100'}>
            <CustomSidebar topManager={user.topManager}/>
            <div className={'flex-grow-1'} style={{backgroundColor: '#f5f5f5'}}>
                <div className={'mainSection-box p-5 d-flex flex-column gap-2'}>
                    <div className={'d-flex flex-column gap-2 p-3 rounded-3 border'}>
                        <span className={'text-center fs-3'}>회원정보 관리</span>
                        <div className={'d-flex justify-content-start'}>
                            <button type={'button'}
                                    className={'btn greenBtn'} onClick={openUserSignUpModal}>
                                + 신규등록
                            </button>
                        </div>
                        <table className={'table table-hover text-center'} style={{verticalAlign: 'middle'}}>
                            <thead>
                            <tr>
                                <th>아이디</th>
                                <th>이름</th>
                                <th>그룹</th>
                                <th>작업</th>
                                <th>가입일자</th>
                                <th>사용자 정보</th>
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
                        <UserSignUpModal
                            isOpen={isUserSignUpModal}
                            closeModal={closeUserSignUpModal}
                            selectUser={selectUser}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserManagement;