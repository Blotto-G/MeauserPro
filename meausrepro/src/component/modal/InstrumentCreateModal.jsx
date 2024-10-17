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

    // 계측기별 추가 입력 필드 상태 관리
    const [logger, setLogger] = useState('');
    const [aPlus, setAPlus] = useState('');
    const [aMinus, setAMinus] = useState('');
    const [bPlus, setBPlus] = useState('');
    const [bMinus, setBMinus] = useState('');
    const [knTone, setKnTone] = useState(0); // 1KN_TONE
    const [displacement, setDisplacement] = useState(0); // 설계변위량
    const [depExcavation, setDepExcavation] = useState(0); // 굴착고
    const [zeroRead, setZeroRead] = useState(0); // ZERO_READ
    const [instrument, setInstrument] = useState(0); // 계기상수
    const [tenAllowable, setTenAllowable] = useState(0); // 허용인장력
    const [tenDesign, setTenDesign] = useState(0); // 설계긴장력


    const measurement1Base =
        insType === '변형률계(버팀대)' ? 103 :
            insType === '구조물기울기계' ? 0.001 :
                insType === '균열측정계' ? 0.2 :
                    0;

    const measurement2Base =
        insType === '변형률계(버팀대)' ? 137 :
            insType === '구조물기울기계' ? 0.0012 :
                insType === '균열측정계' ? 0.38 :
                    0;

    const measurement3Base =
        insType === '변형률계(버팀대)' ? 171 :
            insType === '구조물기울기계' ? 0.002 :
                insType === '균열측정계' ? 0.5 :
                    0;

    const verticalPlusBase =
        insType === '하중계_버팀대' || insType === '하중계_PSBEAM' ? 900 :
            insType === '하중계_앵커' ? 50 :
                insType === '변형률계(버팀대)' ? 60 :
                    insType === '구조물기울기계' ? 0.001 :
                        insType === '균열측정계' ? 0.6 :
                            0;

    const verticalMinusBase =
        insType === '하중계_버팀대' ? 0 :
            insType === '하중계_PSBEAM' ? 700 :
                insType === '하중계_앵커' ? 30 :
                    insType === '변형률계(버팀대)' ? -60 :
                        insType === '구조물기울기계' ? -0.001 :
                            insType === '균열측정계' ? -0.1 :
                                0;

    const knToneBase =
        insType === '하중계_버팀대' ? 0.1020408163 :
            insType === '하중계_PSBEAM' ? 0.1020408163 :
                0;

    const tenAllowableBase =
        insType === '하중계_PSBEAM' ? 1188 :
            0;

    useEffect(() => {
        setMeasurement1(measurement1Base);
        setMeasurement2(measurement2Base);
        setMeasurement3(measurement3Base);
        setVerticalPlus(verticalPlusBase);
        setVerticalMinus(verticalMinusBase);
        setKnTone(knToneBase);
        setTenAllowable(tenAllowableBase);
    }, [insType]);

    // 계측기 생성
    const handleCreateInstrument = async () => {
        const wkt = `POINT(${insGeometryData[1]} ${insGeometryData[0]})`;

        const insTypeData = {
            '하중계_버팀대': 'A',
            '하중계_PSBEAM': 'B',
            '하중계_앵커': 'C',
            '변형률계(버팀대)': 'D',
            '구조물기울기계': 'E',
            '균열측정계': 'F',
        };

        const selectedInsType = insTypeData[insType];

        let InsType;

        if (selectedInsType === 'A' || selectedInsType === 'B' || selectedInsType === 'C') {
            if (selectedInsType === 'A') {
                InsType = {
                    logger: logger,
                    knTone: knTone,
                    displacement: displacement,
                    depExcavation: depExcavation,
                    zeroRead: zeroRead,
                    instrument: instrument
                };
            }
            else if (selectedInsType === 'B') {
                InsType = {
                    logger: logger,
                    knTone: knTone,
                    displacement: displacement,
                    depExcavation: depExcavation,
                    zeroRead: zeroRead,
                    instrument: instrument,
                    tenAllowable: tenAllowable
                };
            }
            else {
                InsType = {
                    logger: logger,
                    knTone: knTone,
                    displacement: displacement,
                    depExcavation: depExcavation,
                    zeroRead: zeroRead,
                    instrument: instrument,
                    tenDesign: tenDesign
                };
            }
        } else if (selectedInsType === 'D') {
            InsType = {
                logger: logger,
                displacement: displacement,
                depExcavation: depExcavation
            };
        } else if (selectedInsType === 'F') {
            InsType = {
                displacement: displacement,
                depExcavation: depExcavation
            };
        } else if (selectedInsType === 'E') {
            InsType = {
                aPlus: aPlus,
                aMinus: aMinus,
                bPlus: bPlus,
                bMinus: bMinus,
                depExcavation: depExcavation
            };
        }

        if (!selectedInsType || !insNum || !createDate || !insLocation || !verticalPlus || !verticalMinus) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        try {
            const res = await axios.post(`http://localhost:8080/MeausrePro/Instrument/save`, {
                instrument: {
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
                },
                insType: InsType
            });

            if (res.data) {
                console.log("계측기 생성 성공:", res.data);
                if (onInstrumentCreated) {
                    onInstrumentCreated(res.data);  // Main으로 응답 데이터 전달
                }
                handleCloseModal();
            } else {
                console.error("서버 응답이 없습니다.");
            }
        } catch (error) {
            console.error("계측기 생성 중 오류 발생:", error);
        }
    };


    // 모달 닫기 전 입력창 비우기
    const handleCloseModal = () => {
        setInsType('');
        setInsNum('');
        setInsName('');
        setInsNo('');
        setCreateDate(today);
        setInsLocation('');
        setMeasurement1(0);
        setMeasurement2(0);
        setMeasurement3(0);
        setVerticalPlus(0);
        setVerticalMinus(0);
        setLogger('');
        setAPlus('');
        setAMinus('');
        setBPlus('');
        setBMinus('');
        setKnTone(0);
        setDisplacement(0);
        setDepExcavation(0);
        setZeroRead(0);
        setInstrument(0);
        setTenAllowable(0);
        setTenDesign(0);
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
            data-bs-backdrop={'static'}
            data-bs-keyboard={'false'}
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
                                <div className={'col-6 d-flex flex-column'}>
                                    <label htmlFor={'insType'}
                                           className={'form-label mt-2'}>
                                        계측기 종류:
                                    </label>
                                    <select className={'form-select'} id={'insType'} value={insType}
                                            onChange={handleSelectInsTypeChange}>
                                        <option selected value="">구간내계측기종류선택</option>
                                        <option value="하중계_버팀대">하중계_버팀대</option>
                                        <option value="하중계_PSBEAM">하중계_PSBEAM</option>
                                        <option value="하중계_앵커">하중계_앵커</option>
                                        <option value="변형률계(버팀대)">변형률계(버팀대)</option>
                                        <option value="구조물기울기계">구조물기울기계</option>
                                        <option value="균열측정계">균열측정계</option>
                                    </select>
                                </div>
                                <div className={'col-6 d-flex flex-column'}>
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
                                <div className={'col-6 d-flex flex-column mt-2'}>
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
                                <div className={'col-6 d-flex flex-column mt-2'}>
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
                            {['', '하중계_버팀대', '하중계_PSBEAM', '하중계_앵커', '변형률계(버팀대)', '구조물기울기계', '균열측정계'].includes(insType) && (
                                <div>
                                    <div className={'row'}>
                                        {['하중계_버팀대', '하중계_PSBEAM', '하중계_앵커', '변형률계(버팀대)'].includes(insType) && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
                                                <label htmlFor={'logger'}
                                                       className={'form-label mt-2'}>
                                                    logger명:
                                                </label>
                                                <input type={'text'}
                                                       className={'form-control'}
                                                       id={'logger'}
                                                       value={logger}
                                                       onChange={(e) => setLogger(e.target.value)}
                                                       placeholder={'계측기 관리번호를 입력하세요'}
                                                />
                                            </div>
                                        )}
                                        <div className={'col-6 d-flex flex-column mt-2'}>
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
                                        <div className={'col-6 d-flex flex-column mt-2'}>
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
                                        {['하중계_버팀대', '하중계_PSBEAM', '하중계_앵커', '변형률계(버팀대)', '구조물기울기계', '균열측정계'].includes(insType) && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
                                                <label htmlFor={'displacement'}
                                                       className={'form-label mt-2'}>
                                                    설계변위량:
                                                </label>
                                                <div className={'input-group'}>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setDisplacement(displacement - 1)
                                                            }}>-
                                                    </button>
                                                    <input type="text" id={'displacement'} value={displacement}
                                                           className={'form-control text-center'}
                                                           onChange={(e) => setDisplacement(e.target.value)}/>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setDisplacement(displacement + 1)
                                                            }}>+
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {['하중계_버팀대', '하중계_PSBEAM', '하중계_앵커', '변형률계(버팀대)', '구조물기울기계', '균열측정계'].includes(insType) && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
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
                                                           onChange={(e) => setMeasurement1(e.target.value)}/>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setMeasurement1(measurement1 + 1)
                                                            }}>+
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {['하중계_버팀대', '하중계_PSBEAM', '하중계_앵커', '변형률계(버팀대)', '구조물기울기계', '균열측정계'].includes(insType) && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
                                                <label htmlFor={'depExcavation'}
                                                       className={'form-label mt-2'}>
                                                    굴착고:
                                                </label>
                                                <div className={'input-group'}>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setDepExcavation(depExcavation - 1)
                                                            }}>-
                                                    </button>
                                                    <input type="text" id={'depExcavation'} value={depExcavation}
                                                           className={'form-control text-center'}
                                                           onChange={(e) => setDepExcavation(e.target.value)}/>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setDepExcavation(depExcavation + 1)
                                                            }}>+
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {['하중계_버팀대', '하중계_PSBEAM', '하중계_앵커', '변형률계(버팀대)', '구조물기울기계', '균열측정계'].includes(insType) && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
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
                                                           onChange={(e) => setMeasurement2(e.target.value)}/>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setMeasurement2(measurement2 + 1)
                                                            }}>+
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {['하중계_버팀대', '하중계_PSBEAM', '하중계_앵커', '변형률계(버팀대)', '구조물기울기계', '균열측정계'].includes(insType) && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
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
                                        )}
                                        {['하중계_버팀대', '하중계_PSBEAM', '하중계_앵커', '변형률계(버팀대)', '구조물기울기계', '균열측정계'].includes(insType) && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
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
                                                           onChange={(e) => setMeasurement3(e.target.value)}/>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setMeasurement3(measurement3 + 1)
                                                            }}>+
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {['하중계_버팀대', '하중계_PSBEAM', '하중계_앵커'].includes(insType) && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
                                                <label htmlFor={'zeroRead'}
                                                       className={'form-label mt-2'}>
                                                    ZERO READ:
                                                </label>
                                                <div className={'input-group'}>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setZeroRead(zeroRead - 1)
                                                            }}>-
                                                    </button>
                                                    <input type="text" id={'zeroRead'} value={zeroRead}
                                                           className={'form-control text-center'}
                                                           onChange={(e) => setZeroRead(e.target.value)}/>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setZeroRead(zeroRead + 1)
                                                            }}>+
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {['하중계_버팀대', '하중계_PSBEAM', '하중계_앵커', '변형률계(버팀대)', '구조물기울기계', '균열측정계'].includes(insType) && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
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
                                                            onClick={() => {
                                                                setVerticalPlus(verticalPlus + 1)
                                                            }}>+
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {['하중계_버팀대', '하중계_PSBEAM', '하중계_앵커', '변형률계(버팀대)', '구조물기울기계', '균열측정계'].includes(insType) && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
                                                <label htmlFor={'verticalMinus'}
                                                       className={'form-label mt-2'}>
                                                    수직변위(-Y):
                                                </label>
                                                <div className={'input-group'}>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setVerticalMinus(verticalMinus - 1)
                                                            }}>-
                                                    </button>
                                                    <input type="text" id={'verticalMinus'} value={verticalMinus}
                                                           className={'form-control text-center'}
                                                           onChange={(e) => setVerticalMinus(e.target.value)}/>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setVerticalMinus(verticalMinus + 1)
                                                            }}>+
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {['하중계_버팀대', '하중계_PSBEAM', '하중계_앵커'].includes(insType) && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
                                                <label htmlFor={'instrument'}
                                                       className={'form-label mt-2'}>
                                                    계기상수:
                                                </label>
                                                <div className={'input-group'}>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setInstrument(instrument - 1)
                                                            }}>-
                                                    </button>
                                                    <input type="text" id={'instrument'} value={instrument}
                                                           className={'form-control text-center'}
                                                           onChange={(e) => setInstrument(e.target.value)}/>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setInstrument(instrument + 1)
                                                            }}>+
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {['하중계_버팀대', '하중계_PSBEAM'].includes(insType) && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
                                                <label htmlFor={'knTone'}
                                                       className={'form-label mt-2'}>
                                                    1KN_TONE:
                                                </label>
                                                <div className={'input-group'}>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setKnTone(knTone - 1)
                                                            }}>-
                                                    </button>
                                                    <input type="text" id={'knTone'} value={knTone}
                                                           className={'form-control text-center'}
                                                           onChange={(e) => setKnTone(e.target.value)}/>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setKnTone(knTone + 1)
                                                            }}>+
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {insType === '하중계_PSBEAM' && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
                                                <label htmlFor={'tenAllowable'}
                                                       className={'form-label mt-2'}>
                                                    허용인장력:
                                                </label>
                                                <div className={'input-group'}>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setTenAllowable(tenAllowable - 1)
                                                            }}>-
                                                    </button>
                                                    <input type="text" id={'tenAllowable'} value={tenAllowable}
                                                           className={'form-control text-center'}
                                                           onChange={(e) => setTenAllowable(e.target.value)}/>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setTenAllowable(tenAllowable + 1)
                                                            }}>+
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {insType === '하중계_앵커' && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
                                                <label htmlFor={'tenDesign'}
                                                       className={'form-label mt-2'}>
                                                    설계긴장력:
                                                </label>
                                                <div className={'input-group'}>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setTenDesign(tenDesign - 1)
                                                            }}>-
                                                    </button>
                                                    <input type="text" id={'tenDesign'} value={tenDesign}
                                                           className={'form-control text-center'}
                                                           onChange={(e) => setTenDesign(e.target.value)}/>
                                                    <button className={'btn btn-outline-secondary'} type={'button'}
                                                            onClick={() => {
                                                                setTenDesign(tenDesign + 1)
                                                            }}>+
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {insType === '구조물기울기계' && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
                                                <label htmlFor={'aPlus'}
                                                       className={'form-label mt-2'}>
                                                    A(+):
                                                </label>
                                                <input type={'text'}
                                                       className={'form-control'}
                                                       id={'aPlus'}
                                                       value={aPlus}
                                                       onChange={(e) => setAPlus(e.target.value)}
                                                       placeholder={'A(+)을 입력하세요'}
                                                />
                                            </div>
                                        )}
                                        {insType === '구조물기울기계' && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
                                                <label htmlFor={'aMinus'}
                                                       className={'form-label mt-2'}>
                                                    A(-):
                                                </label>
                                                <input type={'text'}
                                                       className={'form-control'}
                                                       id={'aMinus'}
                                                       value={aMinus}
                                                       onChange={(e) => setAMinus(e.target.value)}
                                                       placeholder={'A(-)을 입력하세요'}
                                                />
                                            </div>
                                        )}
                                        {insType === '구조물기울기계' && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
                                                <label htmlFor={'bPlus'}
                                                       className={'form-label mt-2'}>
                                                    B(+):
                                                </label>
                                                <input type={'text'}
                                                       className={'form-control'}
                                                       id={'bPlus'}
                                                       value={bPlus}
                                                       onChange={(e) => setBPlus(e.target.value)}
                                                       placeholder={'B(+)을 입력하세요'}
                                                />
                                            </div>
                                        )}
                                        {insType === '구조물기울기계' && (
                                            <div className={'col-6 d-flex flex-column mt-2'}>
                                                <label htmlFor={'bMinus'}
                                                       className={'form-label mt-2'}>
                                                    B(-):
                                                </label>
                                                <input type={'text'}
                                                       className={'form-control'}
                                                       id={'bMinus'}
                                                       value={bMinus}
                                                       onChange={(e) => setBMinus(e.target.value)}
                                                       placeholder={'B(-)을 입력하세요'}
                                                />
                                            </div>
                                        )}
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