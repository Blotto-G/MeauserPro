import {useEffect, useState} from "react";
import axios from "axios";

function InstrumentCreateModal(props) {
    const { insGeometryData, projectData, sectionData, isOpen, closeModal } = props;

    const [siteName, setSiteName] = useState('');
    // const [sectionName, setSectionName] = useState('');

    useEffect(() => {
        if (projectData && isOpen) {
            // 초기값 설정
            setSiteName(projectData.siteName || '');
        }
    }, [projectData, isOpen]);

    // useEffect(() => {
    //     setSectionName(section.sectionName || '');
    // }, [section, isOpen]);

    const dateNow = new Date();
    const today = dateNow.toISOString().slice(0, 10);

    // 입력 필드 상태 관리
    const [insType, setInsType] = useState('Z');    // 'Z' : 선택X
    const [insNum, setInsNum] = useState('');
    const [insName, setInsName] = useState('');
    const [insNo, setInsNo] = useState('');
    const [createDate, setCreateDate] = useState(today);
    const [insLocation, setInsLocation] = useState('');
    const [measurement1, setMeasurement1] = useState(null);
    const [measurement2, setMeasurement2] = useState(null);
    const [measurement3, setMeasurement3] = useState(null);
    const [verticalPlus, setVerticalPlus] = useState(null);
    const [verticalMinus, setVerticalMinus] = useState(null);
    const [division, setDivision] = useState('상')
    const [depExcavation, setDepExcavation] = useState(null);
    const [constantOne, setConstantOne] = useState(null);
    const [constantTwo, setConstantTwo] = useState(null);
    const [constantThree, setConstantThree] = useState(null);
    const [horizontalPlus, setHorizontalPlus] = useState(null);
    const [horizontalMinus, setHorizontalMinus] = useState(null);
    const [displacement, setDisplacement] = useState(null);
    const [depIndicated, setDepIndicated] = useState(null);


    // 구간 생성
    const handleCreateInstrument = async () => {
        console.log(insGeometryData);
        const wkt = `POINT(${insGeometryData[1]} ${insGeometryData[0]})`;
        console.log(wkt);
        axios.post(`http://localhost:8080/MeausrePro/Instrument/save`, {
            sectionId: section,
            insType: insType,
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
            verticalMinus: verticalMinus,
            division: division,
            depExcavation: depExcavation,
            constantOne: constantOne,
            constantTwo: constantTwo,
            constantThree: constantThree,
            horizontalPlus: horizontalPlus,
            horizontalMinus: horizontalMinus,
            displacement: displacement,
            depIndicated: depIndicated
        })
            .then(res => {
                if (!insNum || !insName || !insNo || !createDate || !insLocation || !measurement1 || !measurement2 || !measurement3 || !verticalPlus || !verticalMinus) {
                    alert("모든 필드를 입력해주세요.");
                    return;
                }
                else {
                    console.log(res);
                    handleCloseModal();
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    // 모달 닫기 전 입력창 비우기
    const handleCloseModal = () => {
        setInsType('Z');
        setInsNum('');
        setInsName('');
        setInsNo('');
        setCreateDate('');
        setInsLocation('');
        setMeasurement1('');
        setMeasurement2('');
        setMeasurement3('');
        setVerticalPlus('');
        setVerticalMinus('');
        setDivision('');
        setDepExcavation('');
        setConstantOne('');
        setConstantTwo('');
        setConstantThree('');
        setHorizontalPlus('');
        setHorizontalMinus('');
        setDisplacement('');
        setDepIndicated('');
        closeModal();
    };

    const [selectdInsType, setSelectedInsType] = useState('');

    const handleInsTypeChange = (e) => {
        setSelectedInsType(e.target.value);
    };


    const handleIncreaseDep = () => {
        setDepExcavation(prev => prev + 1); // 오른쪽 버튼 클릭 시 값 증가
    };
    const handleIncreaseConOne = () => {
        setConstantOne(prev => prev + 1);
    };
    const handleIncreaseConTwo = () => {
        setConstantTwo(prev => prev + 1);
    };
    const handleIncreaseConThree = () => {
        setConstantThree(prev => prev + 1);
    };
    const handleIncreaseHoriP = () => {
        setHorizontalPlus(prev => prev + 1);
    };
    const handleIncreaseHoriM = () => {
        setHorizontalMinus(prev => prev + 1);
    };
    const handleIncreaseVeriP = () => {
        setVerticalPlus(prev => prev + 1);
    };
    const handleIncreaseVeriM = () => {
        setVerticalMinus(prev => prev + 1);
    };
    const handleIncreaseDisplacement = () => {
        setDisplacement(prev => prev + 1);
    };
    const handleIncreaseDepIndi = () => {
        setDepIndicated(prev => prev + 1);
    };


    const handleDecreaseDep = () => {
        setDepExcavation(prev => prev - 1); // 왼쪽 버튼 클릭 시 값 감소
    };
    const handleDecreaseConOne = () => {
        setConstantOne(prev => prev - 1);
    };
    const handleDecreaseConTwo = () => {
        setConstantTwo(prev => prev - 1);
    };
    const handleDecreaseConThree = () => {
        setConstantThree(prev => prev - 1);
    };
    const handleDecreaseHoriP = () => {
        setHorizontalPlus(prev => prev - 1);
    };
    const handleDecreaseHoriM = () => {
        setHorizontalMinus(prev => prev - 1);
    };
    const handleDecreaseVeriP = () => {
        setVerticalPlus(prev => prev - 1);
    };
    const handleDecreaseVeriM = () => {
        setVerticalMinus(prev => prev - 1);
    };
    const handleDecreaseDisplacement = () => {
        setDisplacement(prev => prev - 1);
    };
    const handleDecreaseDepIndi = () => {
        setDepIndicated(prev => prev - 1);
    };

    return (
        <div
            className={`modal fade ${isOpen ? 'show d-block' : ''}`}
            id={'createSection'}
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
                            {/*<span onChange={(e) => setSectionName(e.target.value)}>{sectionName}</span>*/}
                            <span>구간명 입력해야해!!!!!</span>
                            <div className={'row mt-2'}>
                                <div className={'col d-flex flex-column'}>
                                    <label htmlFor={'insType'}
                                           className={'form-label mt-2'}>
                                        계측기 종류:
                                    </label>
                                    <select className={'form-select'} id={'insType'} onChange={handleInsTypeChange}>
                                        <option selected value="Z">구간내계측기종류선택</option>
                                        <option value="A">지중경사계</option>
                                        <option value="B">지하수위계</option>
                                        <option value="C">간극수압계</option>
                                        <option value="D">지표침하계</option>
                                        <option value="E">균열측정계</option>
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
                                    <input type={'text'} className={'form-control'} id={'insGeometry'} value={insGeometryData}
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
                            {selectdInsType === 'A' && (
                                <div>
                                    <div className={'row mt-2'}>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'division'}
                                                   className={'form-label mt-2'}>
                                                상하단구분:
                                            </label>
                                            <select className={'form-select'} id={'division'} value={division}>
                                                <option selected value="상">상부단</option>
                                                <option value="하">하부단</option>
                                            </select>
                                        </div>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'depExcavation'}
                                                   className={'form-label mt-2'}>
                                                굴착고:
                                            </label>
                                            <div className={'input-group'}>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleDecreaseDep}>-
                                                </button>
                                                <input type="number" id={'depExcavation'} value={depExcavation}
                                                       className={'form-control text-center'}
                                                       placeholder={'굴착고를 입력하세요'}
                                                       onChange={(e) => setDepExcavation(e.target.value)}/>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleIncreaseDep}>+
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'row mt-2'}>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'measurement1'}
                                                   className={'form-label mt-2'}>
                                                관리기준치1차:
                                            </label>
                                            <input type={'text'} className={'form-control'} id={'measurement1'}
                                                   value={measurement1}
                                                   onChange={(e) => setMeasurement1(e.target.value)} placeholder={'NaN'}
                                                   disabled={'false'}
                                            />
                                        </div>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'constantOne'}
                                                   className={'form-label mt-2'}>
                                                1차관리기준상수:
                                            </label>
                                            <div className={'input-group'}>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleDecreaseConOne}>-
                                                </button>
                                                <input type="number" id={'constantOne'} value={constantOne}
                                                       className={'form-control text-center'}
                                                       placeholder={'관리기준상수를 입력하세요'}
                                                       onChange={(e) => setConstantOne(e.target.value)}/>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleIncreaseConOne}>+
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'row mt-2'}>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'measurement2'}
                                                   className={'form-label mt-2'}>
                                                관리기준치2차:
                                            </label>
                                            <input type={'text'} className={'form-control'} id={'measurement2'}
                                                   value={measurement2}
                                                   onChange={(e) => setMeasurement2(e.target.value)} placeholder={'NaN'}
                                                   disabled={'false'}
                                            />
                                        </div>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'constantTwo'}
                                                   className={'form-label mt-2'}>
                                                2차관리기준상수:
                                            </label>
                                            <div className={'input-group'}>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleDecreaseConTwo}>-
                                                </button>
                                                <input type="number" id={'constantTwo'} value={constantTwo}
                                                       className={'form-control text-center'}
                                                       placeholder={'관리기준상수를 입력하세요'}
                                                       onChange={(e) => setConstantTwo(e.target.value)}/>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleIncreaseConTwo}>+
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
                                            <input type={'text'} className={'form-control'} id={'measurement3'}
                                                   value={measurement3}
                                                   onChange={(e) => setMeasurement3(e.target.value)} placeholder={'NaN'}
                                                   disabled={'false'}
                                            />
                                        </div>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'constantThree'}
                                                   className={'form-label mt-2'}>
                                                3차관리기준상수:
                                            </label>
                                            <div className={'input-group'}>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleDecreaseConThree}>-
                                                </button>
                                                <input type="number" id={'constantThree'} value={constantThree}
                                                       className={'form-control text-center'}
                                                       placeholder={'관리기준상수를 입력하세요'}
                                                       onChange={(e) => setConstantThree(e.target.value)}/>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleIncreaseConThree}>+
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'row mt-2'}>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'horizontalPlus'}
                                                   className={'form-label mt-2'}>
                                                수평변위(+X):
                                            </label>
                                            <div className={'input-group'}>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleDecreaseHoriP}>-
                                                </button>
                                                <input type="number" id={'horizontalPlus'} value={horizontalPlus}
                                                       className={'form-control text-center'}
                                                       placeholder={'-25'}
                                                       onChange={(e) => setHorizontalPlus(e.target.value)}/>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleIncreaseHoriP}>+
                                                </button>
                                            </div>
                                        </div>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'horizontalMinus'}
                                                   className={'form-label mt-2'}>
                                                수평변위(-X):
                                            </label>
                                            <div className={'input-group'}>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleDecreaseHoriM}>-
                                                </button>
                                                <input type="number" id={'horizontalMinus'} value={horizontalMinus}
                                                       className={'form-control text-center'}
                                                       placeholder={'40'}
                                                       onChange={(e) => setHorizontalMinus(e.target.value)}/>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleIncreaseHoriM}>+
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'row mt-2'}>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'verticalPlus'}
                                                   className={'form-label mt-2'}>
                                                수직변위(+Y):
                                            </label>
                                            <div className={'input-group'}>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleDecreaseVeriP}>-
                                                </button>
                                                <input type="number" id={'verticalPlus'} value={verticalPlus}
                                                       className={'form-control text-center'}
                                                       placeholder={'20'}
                                                       onChange={(e) => setVerticalPlus(e.target.value)}/>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleIncreaseVeriP}>+
                                                </button>
                                            </div>
                                        </div>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'verticalMinus'}
                                                   className={'form-label mt-2'}>
                                                수직변위(-Y):
                                            </label>
                                            <div className={'input-group'}>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleDecreaseVeriM}>-
                                                </button>
                                                <input type="number" id={'verticalMinus'} value={verticalMinus}
                                                       className={'form-control text-center'}
                                                       placeholder={'-5'}
                                                       onChange={(e) => setVerticalMinus(e.target.value)}/>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleIncreaseVeriM}>+
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'row mt-2'}>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'displacement'}
                                                   className={'form-label mt-2'}>
                                                설계변위량:
                                            </label>
                                            <div className={'input-group'}>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleDecreaseDisplacement}>-
                                                </button>
                                                <input type="number" id={'displacement'} value={displacement}
                                                       className={'form-control text-center'}
                                                       placeholder={'설계변위량을 입력하세요'}
                                                       onChange={(e) => setDisplacement(e.target.value)}/>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleIncreaseDisplacement}>+
                                                </button>
                                            </div>
                                        </div>
                                        <div className={'col d-flex flex-column'}>
                                            <label htmlFor={'depIndicated'}
                                                   className={'form-label mt-2'}>
                                                표기심도:
                                            </label>
                                            <div className={'input-group'}>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleDecreaseDepIndi}>-
                                                </button>
                                                <input type="number" id={'depIndicated'} value={depIndicated}
                                                       className={'form-control text-center'}
                                                       placeholder={'표기심도를 입력하세요'}
                                                       onChange={(e) => setDepIndicated(e.target.value)}/>
                                                <button className={'btn btn-outline-secondary'} type={'button'}
                                                        onClick={handleIncreaseDepIndi}>+
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'row mt-2'}>
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