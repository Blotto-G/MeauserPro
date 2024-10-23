import './Modal.css';
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import UserContext from "../../context/UserContext.jsx";

function ProjectEditModal(props) {
    const { user } = useContext(UserContext);
    const { projectData, isOpen, closeModal, onProjectUpdated } = props;

    // 입력 필드 상태 관리
    const [siteName, setSiteName] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('N');
    const [companyIdx, setCompanyIdx] = useState(null);

    // 프로젝트 데이터 불러오기
    useEffect(() => {
        if (projectData && isOpen) {
            // 초기값 설정
            setSiteName(projectData.siteName || '');
            setEndDate(projectData.endDate || '');
            setStatus(projectData.siteCheck || 'N');
            setCompanyIdx(projectData.companyIdx || null);
        }
    }, [projectData, isOpen]);

    // 작업그룹 불러오기
    const [companyList, setCompanyList] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:8080/MeausrePro/Company/allCompany/notDelete`)
            .then(res => {
                setCompanyList(res.data);
            })
            .catch(err => {
                console.log("작업그룹 데이터를 불러오지 못했습니다.", err);
            });
    }, []);

    // 프로젝트 수정
    const handleUpdateProject = async () => {
        try {
            await axios.put(`http://localhost:8080/MeausrePro/Project/updateProject/${projectData.idx}`, {
                userIdx: user,
                companyIdx: companyIdx ? {
                    idx:companyIdx.idx,
                    company: companyIdx.company,
                    companyName: companyIdx.companyName,
                    companyIng: companyIdx.companyIng
                } : null,
                endDate: endDate,
                siteCheck: status,
                siteName: siteName,
            });
            console.log("프로젝트 수정 성공");
            handleCloseModal();
        } catch (err) {
            console.log("프로젝트 수정 중 오류 발생", err);
        }
    };

    // 모달 닫기
    const handleCloseModal = () => {
        onProjectUpdated();
        closeModal();
    };

    return (
        <div
            className={`modal fade ${isOpen ? 'show d-block' : ''}`}
            id="editProject"
            tabIndex="-1"
            data-bs-backdrop={'static'}
            data-bs-keyboard={'false'}
            aria-labelledby="epModalLabel"
            aria-hidden={!isOpen}
            style={{ display: isOpen ? 'block' : 'none' }}
        >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className={'modal-header'}>
                        <div className={'modal-header-text'}>
                            <span id={'epModalLabel'} className={'modal-title'}>
                                MeasurePro
                            </span>
                            <span className={'modal-info'}>
                                공사 프로젝트 수정
                            </span>
                        </div>
                    </div>
                    <div className={'modal-body'}>
                        <div className={'d-flex flex-column'}>
                            <div className={'modal-body-text'}>
                                <span>*</span>
                                <label htmlFor={'siteName'} className={'form-label'}>
                                    현장명
                                </label>
                            </div>
                            <input
                                type="text"
                                className="form-control"
                                id="siteName"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                placeholder="현장명을 입력하세요"
                            />
                            <div className={'modal-body-text mt-3'}>
                                <span>*</span>
                                <label htmlFor={'address'} className={'form-label'}>
                                    주소
                                </label>
                            </div>
                            <input
                                type={'text'}
                                id={'address'}
                                value={projectData ? projectData.siteAddress : ''}
                                disabled
                            />
                            <div className={'modal-body-text mt-3'}>
                                <span>*</span>
                                <label htmlFor={'geometryInfo'}
                                       className={'form-label'}>
                                    지오매트리정보
                                </label>
                            </div>
                            <input
                                type={'text'}
                                id={'geometryInfo'}
                                value={projectData ? projectData.geometry : ''}
                                disabled
                            />
                            <div className={'row'}>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'modal-body-text mt-3'}>
                                        <span>*</span>
                                        <label
                                            htmlFor={'startDate'}
                                            className={'form-label'}>
                                            시작일자
                                        </label>
                                    </div>
                                    <input
                                        type={'text'}
                                        id={'startDate'}
                                        value={projectData ? projectData.startDate : ''}
                                        disabled
                                    />
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'modal-body-text mt-3'}>
                                        <span>*</span>
                                        <label htmlFor={'endDate'} className={'form-label'}>
                                            종료일자
                                        </label>
                                    </div>
                                    <input
                                        type={'date'}
                                        id={'endDate'}
                                        value={endDate}
                                        min={projectData ? projectData.startDate : ''}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'modal-body-text mt-3'}>
                                        <span>*</span>
                                        <label htmlFor={'contractor'} className={'form-label'}>
                                            시공사
                                        </label>
                                    </div>
                                    <input
                                        type={'text'}
                                        id={'contractor'}
                                        value={projectData ? projectData.contractor : ''}
                                        disabled
                                    />
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'modal-body-text mt-3'}>
                                        <span>*</span>
                                        <label htmlFor={'measurer'} className={'form-label'}>
                                            계측사
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="measurer"
                                        value={projectData ? projectData.measurer : ''}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'modal-body-text mt-3'}>
                                        <span>*</span>
                                        <label className={'form-label'}>
                                            종료여부
                                        </label>
                                    </div>
                                    <div className={'d-flex ms-4 gap-4'}>
                                        <label className={'custom-checkbox'}>
                                            <input
                                                type={'checkbox'}
                                                name={'status'}
                                                id={'going'}
                                                aria-label="진행 상태"
                                                checked={status === 'N'}
                                                onChange={() => setStatus('N')}
                                            />
                                            <div className={'checkbox'}></div>
                                            진행
                                        </label>
                                        <label className={'custom-checkbox'}>
                                            <input
                                                type={'checkbox'}
                                                name={'status'}
                                                id={'finish'}
                                                aria-label="종료 상태"
                                                checked={status === 'Y'}
                                                onChange={() => setStatus('Y')}
                                            />
                                            <div className={'checkbox'}></div>
                                            종료
                                        </label>
                                    </div>
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'modal-body-text mt-3'}>
                                        <label htmlFor={'workGroup'} className={'form-label'}>
                                            작업그룹
                                        </label>
                                    </div>
                                    <select
                                        value={companyIdx}
                                        onChange={(e) => setCompanyIdx(e.target.value)}
                                        id="workGroup"
                                    >
                                        <option>선택하세요</option>
                                        {companyList.map((item) => (
                                            <option value={item.idx} key={item.idx}>
                                                {item.companyName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'modal-footer'}>
                        <button
                            type={'button'}
                            className={'close-btn'}
                            data-bs-dismiss={'modal'}
                            onClick={handleCloseModal}
                        >
                            Close
                        </button>
                        <button
                            type={'button'}
                            className={'confirm-btn'}
                            onClick={handleUpdateProject}
                        >
                            수정
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectEditModal;