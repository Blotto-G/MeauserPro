import './Modal.css'
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import UserContext from "../../context/UserContext.jsx";

function ProjectCreateModal(props) {
    const {user} = useContext(UserContext);
    const {geometryData, isOpen, closeModal, onProjectCreated, clearAllMapElements} = props;

    const dateNow = new Date();
    const today = dateNow.toISOString().slice(0, 10);
    // 입력 필드 상태 관리
    const [siteName, setSiteName] = useState('');
    const [address, setAddress] = useState('');
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(startDate);
    const [contractor, setContractor] = useState('');
    const [measurer, setMeasurer] = useState('');
    const [status, setStatus] = useState('N');
    const [companyIdx, setCompanyIdx] = useState(null);

    // 종료날짜 선택 범위 조정
    useEffect(() => {
        setEndDate(startDate);
    }, [startDate]);

    // 작업그룹 불러오기
    const [companyList, setCompanyList] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:8080/MeausrePro/Company/allCompany/notDelete`)
            .then(res => {
                setCompanyList(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])
    const companyOptions = companyList.map(item => ({
        value: item.idx,
        label: item.companyName
    }))

    // 프로젝트 생성
    const handleCreateProject = async () => {
        const selectedCompany = companyIdx ? companyList.find(item => item.idx === parseInt(companyIdx)) : null;

        console.log(geometryData);
        console.log(selectedCompany);
        const wkt = `POLYGON((${geometryData.map(coord => `${coord[1]} ${coord[0]}`).join(', ')}))`;
        console.log(wkt);
        axios.post(`http://localhost:8080/MeausrePro/Project/save`, {
            userIdx: user,
            companyIdx: selectedCompany,
            siteName: siteName,
            siteAddress: address,
            startDate: startDate,
            endDate: endDate,
            contractor: contractor,
            measurer: measurer,
            siteCheck: status,
            geometry: wkt
        })
            .then(res => {
                if (!siteName || !address || !startDate || !endDate || !contractor || !measurer || !status) {
                    alert("모든 필드를 입력해주세요.")

                } else {
                    console.log(res);
                    handleCloseModal();
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    // 모달 닫기
    const handleCloseModal = () => {
        if (clearAllMapElements) {
            clearAllMapElements();
        }
        setSiteName('');
        setAddress('');
        setStartDate('');
        setEndDate('');
        setContractor('');
        setMeasurer('');
        setStatus('N');
        setCompanyIdx(null);
        onProjectCreated();
        closeModal();
    };

    return (
        <div
            className={`modal fade ${isOpen ? 'show d-block' : ''}`}
            id={'createProject'}
            data-bs-backdrop={'static'}
            data-bs-keyboard={'false'}
            tabIndex={'-1'}
            aria-labelledby={'cpModalLabel'}
            aria-hidden={!isOpen}
        >
            <div className={'modal-dialog modal-dialog-centered modal-dialog-scrollable'}>
                <div className={'modal-content'}>
                    <div className={'modal-header'}>
                        <div className={'modal-header-text'}>
                            <span id={'cpModalLabel'} className={'modal-title'}>
                                MeasurePro
                            </span>
                            <span className={'modal-info'}>
                                공사 프로젝트 생성
                            </span>
                        </div>
                    </div>
                    <div className={'modal-body'}>
                        <div className={'modal-body-text'}>
                            <span>*</span>
                            <label htmlFor={'siteName'} className={'form-label'}>
                                현장명
                            </label>
                        </div>
                        <input type={'text'}
                               id={'siteName'}
                               value={siteName}
                               onChange={(e) => setSiteName(e.target.value)}
                               placeholder={'현장명을 입력하세요'}
                        />
                        <div className={'modal-body-text mt-3'}>
                            <span>*</span>
                            <label htmlFor={'address'} className={'form-label'}>
                                주소
                            </label>
                        </div>
                        <input type={'text'}
                               id={'address'}
                               value={address}
                               onChange={(e) => setAddress(e.target.value)}
                               placeholder={'주소를 입력하세요'}
                        />
                        <div className={'modal-body-text mt-3'}>
                            <span>*</span>
                            <label htmlFor={'geometryInfo'} className={'form-label'}>
                                지오매트리정보
                            </label>
                        </div>
                        <input type={'text'}
                               id={'geometryInfo'}
                               placeholder={'지오매트리정보를 입력하세요'} value={geometryData} readOnly/>
                        <div className={'row'}>
                            <div className={'col d-flex flex-column'}>
                                <div className={'modal-body-text mt-3'}>
                                    <span>*</span>
                                    <label htmlFor={'startDate'} className={'form-label'}>
                                        시작일자
                                    </label>
                                </div>
                                <input
                                    type={'date'}
                                    id={'startDate'}
                                    value={startDate}
                                    min={today}
                                    onChange={(e) => setStartDate(e.target.value)}/>
                            </div>
                            <div className={'col d-flex flex-column'}>
                                <div className={'modal-body-text mt-3'}>
                                    <span>*</span>
                                    <label htmlFor={'endDate'} className={'form-label'}>
                                        종료일자
                                    </label>
                                </div>
                                <input type={'date'}
                                       id={'endDate'}
                                       value={endDate}
                                       min={startDate}
                                       onChange={(e) => setEndDate(e.target.value)}
                                       placeholder={'종료일자를 입력하세요'}/>
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
                                <input type={'text'}
                                       id={'contractor'}
                                       value={contractor}
                                       onChange={(e) => setContractor(e.target.value)}
                                       placeholder={'시공사를 입력하세요'}/>
                            </div>
                            <div className={'col d-flex flex-column'}>
                                <div className={'modal-body-text mt-3'}>
                                    <span>*</span>
                                    <label htmlFor={'measurer'} className={'form-label'}>
                                        계측사
                                    </label>
                                </div>
                                <input type={'text'}
                                       id={'measurer'}
                                       placeholder={'계측사를 입력하세요'} value={measurer}
                                       onChange={(e) => setMeasurer(e.target.value)}/>
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
                                <select onChange={(e) => setCompanyIdx(e.target.value)}
                                        id={'workGroup'}>
                                    <option selected>선택하세요</option>
                                    {companyList.map((item) => {
                                        return (
                                            <option value={item.idx} key={item.idx}>
                                                {item.companyName}
                                            </option>
                                        )
                                    })}
                                </select>
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
                                    className={'confirm-btn'}
                                    onClick={handleCreateProject}
                            >
                                생성
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default ProjectCreateModal;