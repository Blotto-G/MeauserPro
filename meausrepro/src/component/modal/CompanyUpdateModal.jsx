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
             data-bs-backdrop={'static'}
             data-bs-keyboard={'false'}
             aria-labelledby={'companyModalLabel'}
             aria-hidden={!isOpen}
        >
            <div className={'modal-dialog modal-dialog-centered modal-dialog-scrollable'}>
                <div className={'modal-content'}>
                    <div className={'modal-header'}>
                        <div className={'modal-header-text'}>
                            <span className={'modal-title'} id={'companyModalLabel'}>
                                MeasurePro
                            </span>
                            <span className={'modal-info'}>
                                MeasurePro 작업그룹 수정
                            </span>
                        </div>
                    </div>
                    <div className={'modal-body'}>
                        <form onSubmit={handleUpdateCompany} className={'loginGrid'}>
                            <div className={'modal-body-text'}>
                                <span>*</span>
                                <label htmlFor={'companyName'} className={'form-label'}>
                                    작업그룹
                                </label>
                            </div>
                            <input
                                type="text"
                                id={'companyName'}
                                className={'form-control'}
                                placeholder="실제 작업그룹 이름을 입력하세요"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                required
                            />
                            <div className={'modal-body-text mt-3'}>
                                <span>*</span>
                                <label htmlFor={'companyDes'} className={'form-label'}>
                                    작업그룹 명칭
                                </label>
                            </div>
                            <input
                                type={'text'}
                                id={'companyDes'}
                                className={'form-control'}
                                placeholder="작업그룹 명칭을 입력하세요"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                            />
                            <div className={'modal-footer'}>
                                <button type={'button'}
                                        onClick={handleCloseModal}
                                        className={'close-btn'}>
                                    Close
                                </button>
                                <button
                                    type={"submit"}
                                    className={'confirm-btn'}>
                                    수정
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyUpdateModal;