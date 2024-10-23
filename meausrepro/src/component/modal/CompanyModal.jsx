import {useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";

function CompanyModal(props) {
    const {isOpen, closeModal, selectCompany} = props;

    const [company, setCompany] = useState('');
    const [companyName, setCompanyNmae] = useState('');

    // 모달 닫기
    const handleCloseModal = () => {
        setCompany('');
        setCompanyNmae('');

        selectCompany();
        closeModal();
    }

    // 회사 추가 처리
    const companyInsert = async (e) => {
        e.preventDefault();

        if (company.length !== 0 && companyName.length !== 0) {
            axios.post(`http://localhost:8080/MeausrePro/Company/SaveCompany`, {
                company:company,
                companyName:companyName,
                companyIng:'Y'
            })
                .then(res => {
                    console.log(res);
                    handleCloseModal();
                })
                .catch(err=> {
                    Swal.fire({
                        icon: "error",
                        text: `${err.response.data.message}`,
                        showCancelButton: false,
                        confirmButtonText: '확인'
                    })
                })
        }
        else {
            Swal.fire({
                icon: "info",
                text: `필드값을 모두 입력하세요.`,
                showCancelButton: false,
                confirmButtonText: '확인'
            })
        }
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
                                MeasurePro 작업그룹 추가
                            </span>
                        </div>
                    </div>
                    <div className={'modal-body'}>
                        <form onSubmit={companyInsert} className={'loginGrid'}>
                            <div className={'modal-body-text'}>
                                <span>*</span>
                                <label htmlFor={'companyName'} className={'form-label'}>
                                    작업그룹
                                </label>
                            </div>
                            <input
                                type={'text'}
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
                                onChange={(e) => setCompanyNmae(e.target.value)}
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
                                    작업그룹 생성
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyModal;