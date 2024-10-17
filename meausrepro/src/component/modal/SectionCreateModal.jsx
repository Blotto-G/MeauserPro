import {useState} from "react";
import axios from "axios";
import './Modal.css';

function SectionCreateModal(props) {
    const { project, isOpen, closeModal, onSectionCreated  } = props;
    
    // 입력 필드 상태 관리
    const [sectionName, setSectionName] = useState('');
    const [sectionSta, setSectionSta] = useState('');
    const [wallStr, setWallStr] = useState('');
    const [groundStr, setGroundStr] = useState('');
    const [rearTarget, setRearTarget] = useState('');
    const [underStr, setUnderStr] = useState('');
    
    // 구간 생성
    const handleCreateSection = async () => {
        axios.post(`http://localhost:8080/MeausrePro/Section/save`, {
            projectId: project,
            sectionName: sectionName,
            sectionSta: sectionSta,
            wallStr: wallStr,
            groundStr: groundStr,
            rearTarget: rearTarget,
            underStr: underStr
        })
            .then(res => {
                if (!sectionName || !sectionSta || !wallStr || !groundStr || !rearTarget || !underStr) {
                    alert("모든 필드를 입력해주세요.");
                    return;
                } else {
                    console.log('구간 생성 성공:', res.data);
                    if (onSectionCreated) {
                        onSectionCreated(); // 구간 생성 후 구간 목록을 다시 불러오도록 호출
                    }
                    handleCloseModal();
                }
            })
            .catch(err => {
                console.error('구간 생성 중 오류 발생:', err);
            });
    };


    // 모달 닫기 전 입력창 비우기
    const handleCloseModal = () => {
        setSectionName('');
        setSectionSta('');
        setWallStr('');
        setGroundStr('');
        setRearTarget('');
        setUnderStr('');
        closeModal();
    }
    
    return (
        <div
            className={`modal fade ${isOpen ? 'show d-block' : ''}`}
            id={'createSection'}
            tabIndex={'-1'}
            data-bs-backdrop={'static'}
            data-bs-keyboard={'false'}
            aria-labelledby={'csModalLabel'}
            aria-hidden={!isOpen}
            style={{display: isOpen ? 'block' : 'none'}}
        >
            <div className={'modal-dialog modal-dialog-centered modal-dialog-scrollable'}>
                <div className={'modal-content'}>
                    <div className={'modal-header'}>
                        <div className={'modal-header-text'}>
                            <span id={'cpModalLabel'} className={'modal-title'}>
                                MeausrePro
                            </span>
                            <span className={'modal-info'}>
                                공사 구간 생성
                            </span>
                        </div>
                    </div>
                    <div className={'modal-body'}>
                        <div className={'d-flex flex-column'}>
                            <div className={'modal-body-text'}>
                                <span>*</span>
                                <label htmlFor={'sectionName'}
                                       className={'form-label'}>
                                    구간명
                                </label>
                            </div>
                            <input type={'text'}
                                   id={'sectionName'}
                                   value={sectionName}
                                   onChange={(e) => setSectionName(e.target.value)}
                                   placeholder={'구간명을 입력하세요'}
                            />
                            <div className={'modal-body-text mt-3'}>
                                <span>*</span>
                                <label htmlFor={'sectionSta'}
                                       className={'form-label mt-2'}>
                                    구간 위치 (STA)
                                </label>
                            </div>
                            <input type={'text'}
                                   id={'sectionSta'}
                                   value={sectionSta}
                                   onChange={(e) => setSectionSta(e.target.value)}
                                   placeholder={'구간위치를 입력하세요'}
                            />
                            <div className={'row'}>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'modal-body-text mt-3'}>
                                        <span>*</span>
                                        <label htmlFor={'wallStr'}
                                               className={'form-label'}>
                                            벽체공
                                        </label>
                                    </div>
                                    <input type={'text'}
                                           id={'wallStr'}
                                           value={wallStr}
                                           onChange={(e) => setWallStr(e.target.value)}
                                           placeholder={'벽체공'}
                                    />
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'modal-body-text mt-3'}>
                                        <span>*</span>
                                        <label htmlFor={'groundStr'}
                                               className={'form-label'}>
                                            지지공
                                        </label>
                                    </div>
                                    <input type={'text'}
                                           id={'groundStr'}
                                           value={groundStr}
                                           onChange={(e) => setGroundStr(e.target.value)}
                                           placeholder={'지지공'}
                                    />
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'modal-body-text mt-3'}>
                                        <span>*</span>
                                        <label htmlFor={'rearTarget'}
                                               className={'form-label mt-2'}>
                                            주요관리 대상물 배면
                                        </label>
                                    </div>
                                    <input type={'text'}
                                           id={'rearTarget'}
                                           value={rearTarget}
                                           onChange={(e) => setRearTarget(e.target.value)}
                                           placeholder={'주요관리 대상물 배면'}
                                    />
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'modal-body-text mt-3'}>
                                        <span>*</span>
                                        <label htmlFor={'underStr'}
                                               className={'form-label mt-2'}>
                                            주요관리 대상물 도로하부
                                        </label>
                                    </div>
                                    <input type={'text'}
                                           id={'underStr'}
                                           value={underStr}
                                           onChange={(e) => setUnderStr(e.target.value)}
                                           placeholder={'주요관리 대상물 도로하부'}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={'modal-footer'}>
                            <button type={'button'}
                                    className={'close-btn'}
                                    data-bs-dismiss={'modal'}
                                    onClick={handleCloseModal}
                            >
                                Close
                            </button>
                            <button type={'button'}
                                    className={'confirm-btn'} onClick={handleCreateSection}
                            >
                                구간 생성
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SectionCreateModal;