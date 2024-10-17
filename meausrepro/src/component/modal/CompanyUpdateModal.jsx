import {useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";

function CompanyUpdateModal(props) {
    const {isOpen, closeModal, selectCompany, companyInfo} = props;

    const [company, setCompany] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyIng, setCompanyIng] = useState('')

    useEffect(() => {
        if (companyInfo) {
            setCompany(companyInfo.company);
            setCompanyName(companyInfo.companyName);
            setCompanyIng(companyInfo.companyIng);
        }
    }, [companyInfo]);

    // 입력창 비우기
    const resetForm = () => {
        setCompany('');
        setCompanyName('');
    }

    // 모달 닫기
    const handleCloseModal = () => {
        resetForm();
        selectCompany();
        closeModal();
    }

    // 그룹관리 수정
    const handleUpdateCompany = async (e) => {
        e.preventDefault();

        axios.put(`http://localhost:8080/MeausrePro/Company/update/${companyInfo.idx}`, {
            company: company,
            companyName: companyName,
            companyIng: companyIng
        })
            .then(res => {
                console.log(res);
                handleCloseModal();
            })
            .catch(err => {
                console.log(err);
            });
    }


    return (
        <div className={`modal fade ${isOpen ? 'show d-block' : ''}`}
             id={'createCompany'}
             tabIndex={'-1'}
             aria-labelledby={'companyModalLabel'}
             aria-hidden={!isOpen}
             style={{display: isOpen ? 'block' : 'none'}}
        >
            <div className={'modal-dialog modal-dialog-centered modal-dialog-scrollable'}>
                <div className={'modal-content'}>
                    <div className={'modal-header'}>
                        <span className={'fs-4 modal-title'} id={'companyModalLabel'}>
                            작업그룹 수정
                        </span>
                        <button type={'button'}
                                className={'btn-close'}
                                data-bs-dismiss={'modal'}
                                aria-label={'Close'}
                                onClick={handleCloseModal}
                        />
                    </div>
                    <div className={'modal-body'}>
                        <form onSubmit={handleUpdateCompany} className={'d-grid gap-2'}>
                            <div className={'input-group'}>
                                <span className={'input-group-text'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"></path>
                                </svg>
                            </span>
                                <input
                                    type="text"
                                    className={'form-control'}
                                    placeholder="회사명"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={'input-group'}>
                                <span className={'input-group-text'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-person" viewBox="0 0 16 16">
                                      <path
                                          d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"></path>
                                </svg>
                                </span>
                                <input
                                    type="text"
                                    className={'form-control'}
                                    placeholder="사용할 회사명"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type={"submit"}
                                className={'signUpBtn mt-3'}>
                                수정
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyUpdateModal;