import {useContext, useEffect, useState} from "react";
import UserContext from "../context/UserContext.jsx";
import {useNavigate} from "react-router";
import axios from "axios";
import CustomSidebar from "../component/sidebar/CustomSidebar.jsx";
import CompanyModal from "../component/modal/CompanyModal.jsx";
import Pagination from "../component/pagination/Pagination.jsx";
import Swal from "sweetalert2";
import CompanyUpdateModal from "../component/modal/CompanyUpdateModal.jsx";

function GroupManagement() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // 작업그룹 목록
    const [companyList, setCompanyList] = useState([]);

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

    // 현재 페이지 번호
    const [page, setPage] = useState(1);
    // 페이지 당 게시글 수
    const itemsPerPage = 10;

    // 페이지 이동
    const changePageHandler = (page) => {
        setPage(page);
    };

    // 페이지네이션을 통해 보여줄 slice된 리스트
    const [currentList, setCurrentList] = useState(companyList);

    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    useEffect(() => {
        setCurrentList(companyList.slice(indexOfFirstItem, indexOfLastItem));
    }, [page, companyList]);

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

    // 작업그룹 수정 모달창
    const [isCompanyUpdateModal, setIsCompanyUpdateModal] = useState(false);
    const [companyToEdit, setCompanyToEdit] = useState(null); // 수정할 작업그룹 정보를 저장하는 상태

    // 작업그룹 수정 모달창 열기
    const openCompanyUpdateModal = (company) => {
        setCompanyToEdit(company);
        setIsCompanyUpdateModal(true);
    };

    // 작업그룹 수정 모달창 닫기
    const closeCompanyUpdateModal = () => {
        setIsCompanyUpdateModal(false);
        setCompanyToEdit(null); // 닫을 때 선택된 사용자 정보 초기화
    };

    // 작업그룹 사용여부 토글
    const toggleCompanyStatus = (index) => {
        const updatedCompanyList = [...companyList];
        updatedCompanyList[index].companyIng =
            updatedCompanyList[index].companyIng === "Y" ? "N" : "Y";
        setCompanyList(updatedCompanyList);

        axios
            .put(
                `http://localhost:8080/MeausrePro/Company/update/${updatedCompanyList[index].idx}`,
                updatedCompanyList[index]
            )
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 작업그룹 삭제
    const handleDelete = (idx) => {
        Swal.fire({
            title: '작업그룹 삭제',
            text: "작업그룹을 삭제하시겠습니까?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8080/MeausrePro/Company/delete/${idx}`)
                    .then(() => {
                        setCompanyList(companyList.filter((company) => company.idx !== idx));
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        });
    };

    return (
        <div className={'d-flex vh-100'}>
            <CustomSidebar topManager={user.topManager}/>
            <div className={'flex-grow-1'}>
                <div className={'mainSection d-flex flex-column'}>
                    <div className={'managementSection'}>
                        <span className={'text-center fs-4 fw-bold'}>작업그룹 관리</span>
                        <div className={'d-flex justify-content-end'}>
                            <button type={'button'}
                                    className={'px-3 py-2 rounded-pill managementBtn'} onClick={openCompanyModal}>
                                + 신규등록
                            </button>
                        </div>
                        <div className={'p-3 rounded-3 border align-items-start'}>
                            <table className={'table text-center'} style={{verticalAlign: 'middle'}}>
                                <thead>
                                <tr>
                                    <th>회사명</th>
                                    <th>출력 회사명</th>
                                    <th>사용여부</th>
                                    <th>수정</th>
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
                                            <td className={'d-flex justify-content-center'}>
                                                <div className={'form-check form-switch'}>
                                                    <input type="checkbox" className={'form-check-input'}
                                                           checked={item.companyIng === 'Y'}
                                                           onChange={() => toggleCompanyStatus(index)}/>
                                                </div>

                                            </td>
                                            <td>
                                                <button type={'button'} className={'projectUpdate sideBarBtn'} onClick={() => openCompanyUpdateModal(item)}>
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
                                                <button type={'button'} className={'sideBarBtn projectDelete'}
                                                        onClick={() => handleDelete(item.idx)}>
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
                            {companyList.length > 0 && (
                                <Pagination
                                    activePage={page}
                                    itemsCountPerPage={itemsPerPage}
                                    totalItemsCount={companyList.length}
                                    onChange={changePageHandler}
                                />
                            )}
                        </div>
                        <CompanyModal
                            isOpen={isCompanyModal}
                            closeModal={closeCompanyModal}
                            selectCompany={selectCompany}
                        />
                        <CompanyUpdateModal
                            isOpen={isCompanyUpdateModal}
                            closeModal={closeCompanyUpdateModal}
                            selectCompany={selectCompany}
                            companyInfo={companyToEdit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupManagement;