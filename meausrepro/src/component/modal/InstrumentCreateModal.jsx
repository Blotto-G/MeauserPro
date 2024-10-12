import {useEffect, useState} from "react";
import axios from "axios";

function InstrumentCreateModal(props) {
    const {insGeometryData, projectData, section, isOpen, closeModal, onInstrumentCreated} = props;

    const [siteName, setSiteName] = useState('');
    const [sectionName, setSectionName] = useState('');

    useEffect(() => {
        if (projectData && isOpen) {
            // 초기값 설정
            setSiteName(projectData.siteName || '');
        }
    }, [projectData, isOpen]);

    useEffect(() => {
        if (section && isOpen) {
            // 초기값 설정
            setSectionName(section.sectionName || '');
        }
    }, [section, isOpen]);


    const dateNow = new Date();
    const today = dateNow.toISOString().slice(0, 10);


    // 입력 필드 상태 관리
    const [insType, setInsType] = useState('');
    const [insNum, setInsNum] = useState('');
    const [insName, setInsName] = useState('');
    const [insNo, setInsNo] = useState('');
    const [createDate, setCreateDate] = useState(today);
    const [insLocation, setInsLocation] = useState('');
    const [measurement1, setMeasurement1] = useState(0);
    const [measurement2, setMeasurement2] = useState(0);
    const [measurement3, setMeasurement3] = useState(0);
    const [verticalPlus, setVerticalPlus] = useState(0);
    const [verticalMinus, setVerticalMinus] = useState(0);

    const verticalPlusBase =
        insType === '하중계_버팀대' || insType === '하중계_PSBEAM' ? 900 :
            insType === '하중계_앵커' ? 50 :
                0;
    const verticalMinusBase =
        insType === '하중계_버팀대' ? 0 :
            insType === '하중계_PSBEAM' ? 700 :
                insType === '하중계_앵커' ? 30 :
                    0;

    useEffect(() => {
        setVerticalPlus(verticalPlusBase);
        setVerticalMinus(verticalMinusBase);
    }, [insType]);

    // 구간 생성
    const handleCreateInstrument = async () => {
        console.log(insGeometryData);
        const wkt = `POINT(${insGeometryData[1]} ${insGeometryData[0]})`;
        console.log(wkt);

        const insTypeData = {
            '지중경사계': 'A',
            '지하수위계': 'B',
            '간극수압계': 'C',
            '지표침하계': 'D',
            '하중계_버팀대': 'E',
            '하중계_PSBEAM': 'F',
            '하중계_앵커': 'G',
            '변형률계(버팀대)': 'H',
            '구조물기울기계': 'I',
            '균열측정계': 'J',
        };

        const selectedInsType = insTypeData[insType]; // 선택된 insType에 맞는 데이터 매핑

        axios.post(`http://localhost:8080/MeausrePro/Instrument/save`, {
            sectionId: section,
            insType: selectedInsType,
            insNum: insNum,
            insName: insName,
            insNo: insNo,
            insGeometry: wkt,
            createDate: createDate,
            insLocation: insLocation,
            measurement1: measurement1,
            measurement2: measurement2,
            measurement3: measurement3,
            verticalPlus: verticalPlus,
            verticalMinus: verticalMinus
        })
            .then(res => {
                if (!selectedInsType || !insNum || !createDate || !insLocation || !verticalPlus || !verticalMinus) {
                    alert("모든 필드를 입력해주세요.");
                    return;
                } else {
                    console.log('계측기 생성 성공:', res.data);
                    if (onInstrumentCreated) {
                        onInstrumentCreated(); // 계측기 생성 후 계측기 목록을 다시 불러오도록 호출
                    }
                    handleCloseModal();
                }
            })
            .catch(err => {
                console.log('구간 생성 중 오류 발생:', err);
            })
    }

    // 모달 닫기 전 입력창 비우기
    const handleCloseModal = () => {
        setInsType('');
        setInsNum('');
        setInsName('');
        setInsNo('');
        setCreateDate('');
        setInsLocation('');
        setMeasurement1(0);
        setMeasurement2(0);
        setMeasurement3(0);
        setVerticalPlus(0);
        setVerticalMinus(0);
        onInstrumentCreated();
        closeModal();
    };


    const handleSelectInsTypeChange = (e) => {
        const selectedInsType = e.target.value;
        setInsType(selectedInsType);
    };

    return (
        <div
            className={`modal fade ${isOpen ? 'show d-block' : ''}`}
            id={'createInstrument'}
            tabIndex={'-1'}
            aria-labelledby={'csModalLabel'}
            aria-hidden={!isOpen}
            style={{display: isOpen ? 'block' : 'none'}}
        >
            <div className={'modal-dialog modal-dialog-centered modal-dialog-scrollable'}>
                <div className={'modal-content'}>
                    <div className={'modal-header'}>
                        <span className={'fs-4 modal-title'} id={'cpModalLabel'}>
                            계측기 기본정보
                        </span>
                        <button type={'button'}
                                className={'btn-close'}
                                data-bs-dismiss={'modal'}
                                aria-label={'Close'}
                                onClick={handleCloseModal}
                        />
                    </div>
                    <div className={'modal-body'}>
                        <div className={'d-flex flex-column'}>
                            <span className={'fs-5 modal-title'} id={'cpModalLabel'}>
                                속성
                            </span>
                            <label htmlFor={'siteName'}
                                   className={'form-label mt-2'}>
                                현장명
                            </label>
                            <span onChange={(e) => setSiteName(e.target.value)}>{siteName}</span>
                            <label htmlFor={'sectionName'}
                                   className={'form-label mt-2'}>
                                구간명
                            </label>
                            <span onChange={(e) => setSectionName(e.target.value)}>{sectionName}</span>
                            <div className={'row mt-2'}>
                                <div className={'col d-flex flex-column'}>
                                    <label htmlFor={'insType'}
                                           className={'form-label mt-2'}>
                                        계측기 종류:
                                    </label>
                                    <select className={'form-select'} id={'insType'} value={insType}
                                            onChange={handleSelectInsTypeChange}>
                                        <option selected value="">구간내계측기종류선택</option>
                                        <option value="지중경사계">지중경사계</option>
                                        <option value="지하수위계">지하수위계</option>
                                        <option value="간극수압계">간극수압계</option>
                                        <option value="지표침하계">지표침하계</option>
                                        <option value="하중계_버팀대">하중계_버팀대</option>
                                        <option value="하중계_PSBEAM">하중계_PSBEAM</option>
                                        <option value="하중계_앵커">하중계_앵커</option>
                                        <option value="변형률계(버팀대)">변형률계(버팀대)</option>
                                        <option value="구조물기울기계">구조물기울기계</option>
                                        <option value="균열측정계">균열측정계</option>
                                    </select>
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <label htmlFor={'insNum'}
                                           className={'form-label mt-2'}>
                                        계측기 관리번호:
                                    </label>
                                    <input type={'text'}
                                           className={'form-control'}
                                           id={'insNum'}
                                           value={insNum}
                                           onChange={(e) => setInsNum(e.target.value)}
                                           placeholder={'계측기 관리번호를 입력하세요'}
                                    />
                                </div>
                            </div>
                            <div className={'row mt-2'}>
                                <div className={'col d-flex flex-column'}>
                                    <label htmlFor={'insName'}
                                           className={'form-label mt-2'}>
                                        제품명:
                                    </label>
                                    <input type={'text'}
                                           className={'form-control'}
                                           id={'insName'}
                                           value={insName}
                                           onChange={(e) => setInsName(e.target.value)}
                                           placeholder={'제품명을 입력하세요'}
                                    />
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <label htmlFor={'insNo'}
                                           className={'form-label mt-2'}>
                                        시리얼NO:
                                    </label>
                                    <input type={'text'}
                                           className={'form-control'}
                                           id={'insNo'}
                                           value={insNo}
                                           onChange={(e) => setInsNo(e.target.value)}
                                           placeholder={'시리얼 넘버를 입력하세요'}
                                    />
                                </div>
                            </div>
                            <div className={'row mt-2'}>
                                <div className={'col d-flex flex-column'}>
                                    <label htmlFor={'insGeometry'}
                                           className={'form-label mt-2'}>
                                        지오매트리정보:
                                    </label>
                                    <input type={'text'} className={'form-control'} id={'insGeometry'}
                                           value={insGeometryData}
                                           onChange={(e) => setInsNo(e.target.value)}
                                           placeholder={'지오매트리정보를 입력하세요'} readOnly
                                    />
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <label htmlFor={'createDate'}
                                           className={'form-label mt-2'}>
                                        설치일자:
                                    </label>
                                    <input
                                        type={'date'}
                                        id={'createDate'}
                                        className={'form-control'}
                                        value={createDate}
                                        min={today}
                                        onChange={(e) => setCreateDate(e.target.value)}/>
                                </div>
                            </div>
                            {['하중계_버팀대', '하중계_PSBEAM', '하중계_앵커'].includes(insType) && (
                                <div>

                                    <div className={'row mt-2'}>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'measurement1'}
                                                   className={'form-label mt-2'}>
                                                관리기준치1차:
                                            </label>
                                            <div className={'input-group'}>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={() => {
                                                            setMeasurement1(measurement1 - 1)
                                                        }}>-
                                                </button>
                                                <input type="text" id={'measurement1'} value={measurement1}
                                                       className={'form-control text-center'}
                                                       placeholder={'관리기준치1차를 입력하세요'}
                                                       onChange={(e) => setMeasurement1(e.target.value)}/>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={() => {
                                                            setMeasurement1(measurement1 + 1)
                                                        }}>+
                                                </button>
                                            </div>
                                        </div>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'measurement2'}
                                                   className={'form-label mt-2'}>
                                                관리기준치2차:
                                            </label>
                                            <div className={'input-group'}>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={() => {
                                                            setMeasurement2(measurement2 - 1)
                                                        }}>-
                                                </button>
                                                <input type="text" id={'measurement2'} value={measurement2}
                                                       className={'form-control text-center'}
                                                       placeholder={'관리기준치2차를 입력하세요'}
                                                       onChange={(e) => setMeasurement2(e.target.value)}/>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={() => {
                                                            setMeasurement2(measurement2 + 1)
                                                        }}>+
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={'row mt-2'}>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'measurement3'}
                                                   className={'form-label mt-2'}>
                                                관리기준치3차:
                                            </label>
                                            <div className={'input-group'}>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={() => {
                                                            setMeasurement3(measurement3 - 1)
                                                        }}>-
                                                </button>
                                                <input type="text" id={'measurement3'} value={measurement3}
                                                       className={'form-control text-center'}
                                                       placeholder={'관리기준치3차를 입력하세요'}
                                                       onChange={(e) => setMeasurement3(e.target.value)}/>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={() => {
                                                            setMeasurement3(measurement3 + 1)
                                                        }}>+
                                                </button>
                                            </div>
                                        </div>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'verticalPlus'}
                                                   className={'form-label mt-2'}>
                                                수직변위(+Y):
                                            </label>
                                            <div className={'input-group'}>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={() => {
                                                            setVerticalPlus(verticalPlus - 1)
                                                        }}>-
                                                </button>
                                                <input type="text" id={'verticalPlus'} value={verticalPlus}
                                                       className={'form-control text-center'}
                                                       onChange={(e) => setVerticalPlus(e.target.value)}/>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={() => {setVerticalPlus(verticalPlus + 1)}}>+
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={'row mt-2'}>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'verticalMinus'}
                                                   className={'form-label mt-2'}>
                                                수직변위(-Y):
                                            </label>
                                            <div className={'input-group'}>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={() => {setVerticalMinus(verticalMinus - 1)}}>-
                                                </button>
                                                <input type="text" id={'verticalMinus'} value={verticalMinus}
                                                       className={'form-control text-center'}
                                                       onChange={(e) => setVerticalMinus(e.target.value)}/>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={() => {setVerticalMinus(verticalMinus + 1)}}>+
                                                </button>
                                            </div>
                                        </div>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'insLocation'}
                                                   className={'form-label mt-2'}>
                                                설치위치:
                                            </label>
                                            <input type={'text'}
                                                   className={'form-control'}
                                                   id={'insLocation'}
                                                   value={insLocation}
                                                   onChange={(e) => setInsLocation(e.target.value)}
                                                   placeholder={'설치위치를 입력하세요'}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={'modal-footer'}>
                            <button type={'button'}
                                    className={'btn btn-outline-dark opacity-50'}
                                    data-bs-dismiss={'modal'}
                                    onClick={handleCloseModal}
                            >
                                Close
                            </button>
                            <button type={'button'}
                                    className={'btn btn-success opacity-50'} onClick={handleCreateInstrument}
                            >
                                계측기 생성
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InstrumentCreateModal;