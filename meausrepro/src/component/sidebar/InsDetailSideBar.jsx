import {useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {Link, useLocation} from "react-router-dom";
import printJS from "print-js";
import {QRCodeCanvas} from "qrcode.react";

function InsDetailSideBar(props) {
    const {instrument, handleClose, deleteInstrument, handleInstrumentUpdated, siteName, sectionName} = props;
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const location = useLocation();

    const dateNow = new Date();
    const today = dateNow.toISOString().slice(0, 10); // 'yyyy-mm-dd' 형식으로 오늘 날짜를 얻음

    // 계측기 데이터 상태 초기화
    const [insData, setInsData] = useState({
        insType: '',
        insNum: '',
        insName: '',
        insNo: '',
        createDate: today,
        insLocation: '',
        measurement1: 0,
        measurement2: 0,
        measurement3: 0,
        verticalPlus: 0,
        verticalMinus: 0,
        logger: '',
        aPlus: '',
        aMinus: '',
        bPlus: '',
        bMinus: '',
        knTone: 0,
        displacement: 0,
        depExcavation: 0,
        zeroRead: 0,
        tenAllowable: 0,
        tenDesign: 0,
        insTypeName: ''
    });

    useEffect(() => {
        if (instrument) {
            setInsData({
                ...insData,
                ...instrument,
                createDate: instrument.createDate || today,
                insType: instrument.insType,  // 직접 insType 값을 설정
                insTypeName: getInsTypeName(instrument.insType)  // 표시 이름으로 변환
            });
        }
    }, [instrument]);

    // 계측기 타입 이름 가져오기
    const getInsTypeName = (type) => {
        switch (type) {
            case 'A':
                return '하중계 버팀대';
            case 'B':
                return '하중계 PSBEAM';
            case 'C':
                return '하중계 앵커';
            case 'D':
                return '변형률계';
            case 'E':
                return '구조물 기울기계';
            case 'F':
                return '균열측정계';
            default:
                return '';
        }
    };

    const parseGeometryData = (data) => {
        if (!data || !data.startsWith('POINT(')) {
            return '정보 없음';
        }
        const coordinates = data.slice(6, -1).split(' ');
        if (coordinates.length === 2) {
            const longitude = coordinates[0];
            const latitude = coordinates[1];
            return `경도: ${longitude}, 위도: ${latitude}`;
        }
        return '정보 없음';
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setInsData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleCloseClick = () => {
        setIsOpen(false);
        setTimeout(() => {
            handleClose();
        }, 300);
    };

    useEffect(() => {
        setIsOpen(true);
    }, []);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const saveChanges = () => {
        const data = {
            instrument: {  // instrument 속성을 객체로 감쌈
                idx: instrument.idx,
                insName: insData.insName,
                insLocation: insData.insLocation,
                insNum: insData.insNum,
                insNo: insData.insNo,
                createDate: insData.createDate,
                verticalPlus: insData.verticalPlus,
                verticalMinus: insData.verticalMinus,
                measurement1: insData.measurement1,
                measurement2: insData.measurement2,
                measurement3: insData.measurement3,
                insType: instrument.insType
            },
            insType: {  // 추가 테이블 정보
                logger: insData.logger,
                aPlus: insData.aPlus,
                aMinus: insData.aMinus,
                bPlus: insData.bPlus,
                bMinus: insData.bMinus,
                knTone: insData.knTone,
                displacement: insData.displacement,
                depExcavation: insData.depExcavation,
                zeroRead: insData.zeroRead,
                tenAllowable: insData.tenAllowable,
                tenDesign: insData.tenDesign
            }
        };

        console.log("Sending data: ", data); // 전송 데이터 확인

        axios.put('http://localhost:8080/MeausrePro/Instrument/update', data)
            .then((res) => {
                console.log(res);
                const updatedInstrument = {
                    ...instrument,
                    ...insData
                };
                handleInstrumentUpdated(updatedInstrument);  // 부모 컴포넌트에 업데이트된 데이터를 전달
                toggleEdit();  // 수정 모드 종료
            })
            .catch((err) => {
                if (err.response) {
                    console.error("서버 응답 오류:", err.response.data); // 서버 응답의 문제일 경우
                } else if (err.request) {
                    console.error("요청 오류:", err.request); // 요청이 이루어졌으나 응답이 없을 경우
                } else {
                    console.error("계측기 수정 중 기타 오류 발생:", err.message); // 그 외의 오류 메시지
                }
            });
    };


    const handleDelete = () => {
        Swal.fire({
            title: '계측기 삭제',
            text: "이 계측기를 삭제하시겠습니까?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteInstrument(instrument); // 선택된 계측기 정보를 전달
            }
        });
    };


    return (
        <div className={`sectionDetailSideBar ${isOpen ? 'open' : ''}`}>
            <div className={'sideBarHeader'}>
                <span className={'fw-bold sectionSideBarTitle'}>계측기 상세 정보</span>
                <div className={'d-flex gap-2'}>
                    <Link
                        to={`/InsPage/${instrument.idx}`}
                        className={'text-decoration-none'}>
                        <button
                            type={'button'}
                            className={`sideBarBtn ${location.pathname === `/InsPage/${instrument.idx}` ? 'active' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="gold"
                                 className="bi bi-clipboard-data" viewBox="0 0 16 16">
                                <path
                                    d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0z"/>
                                <path
                                    d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                                <path
                                    d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                            </svg>
                        </button>
                    </Link>
                    <button
                        type={'button'}
                        onClick={isEditing ? saveChanges : toggleEdit}  // 저장 및 수정 모드 전환
                        className={'sideBarBtn projectUpdate'}
                    >
                        {isEditing ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-floppy2-fill" viewBox="0 0 16 16">
                                <path d="M12 2h-2v3h2z"/>
                                <path
                                    d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5V2.914a1.5 1.5 0 0 0-.44-1.06L14.147.439A1.5 1.5 0 0 0 13.086 0zM4 6a1 1 0 0 1-1-1V1h10v4a1 1 0 0 1-1 1zM3 9h10a1 1 0 0 1 1 1v5H2v-5a1 1 0 0 1 1-1"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                 fill="currentColor" className="bi bi-pencil-square"
                                 viewBox="0 0 16 16">
                                <path
                                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fillRule="evenodd"
                                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                            </svg>
                        )}
                    </button>
                    <button
                        className={'sideBarBtn projectDelete'}
                        onClick={handleDelete}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-trash3" viewBox="0 0 16 16">
                            <path
                                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                    </button>
                    <button
                        className={'sideBarBtn'}
                        onClick={handleCloseClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                             className="bi bi-x" viewBox="0 0 16 16">
                            <path
                                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div className={'d-flex flex-column gap-2'}>
                {isEditing ? (
                    <div className={'InsDetail'}>
                        <div className={'row'}>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>계측기명</span>
                                <input
                                    type={'text'}
                                    name="insName"
                                    className={'form-control'}
                                    value={insData.insName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>계측기 관리번호</span>
                                <input
                                    type={'text'}
                                    name="insNum"
                                    className={'form-control'}
                                    value={insData.insNum}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className={'d-flex flex-column gap-1'}>
                            <span className={'text-muted small'}>시리얼 NO</span>
                            <input
                                type={'text'}
                                name="insNo"
                                className={'form-control'}
                                value={insData.insNo}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={'d-flex flex-column gap-1'}>
                            <span className={'text-muted small'}>계측기 종류</span>
                            <input
                                type={'text'}
                                className={'form-control'}
                                value={insData.insTypeName}
                                readOnly
                            />
                        </div>
                        <div className={'d-flex flex-column gap-1'}>
                            <span className={'text-muted small'}>설치 위치</span>
                            <input
                                type={'text'}
                                name="insLocation"
                                className={'form-control'}
                                value={insData.insLocation}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={'d-flex flex-column gap-1'}>
                            <span className={'text-muted small'}>설치일자</span>
                            <input
                                type={'date'}
                                name="createDate"
                                className={'form-control'}
                                value={insData.createDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={'d-flex flex-column gap-1'}>
                            <span className={'text-muted small'}>지오메트리 정보</span>
                            <input
                                type={'text'}
                                className={'form-control'}
                                value={parseGeometryData(instrument?.insGeometry)}
                                readOnly
                            />
                        </div>
                        <div className={'row'}>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>관리기준치1차</span>
                                <input
                                    type={'number'}
                                    name="measurement1"
                                    className={'form-control'}
                                    value={insData.measurement1}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>관리기준치2차</span>
                                <input
                                    type={'number'}
                                    name="measurement2"
                                    className={'form-control'}
                                    value={insData.measurement2}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className={'d-flex flex-column gap-1'}>
                            <span className={'text-muted small'}>관리기준치3차</span>
                            <input
                                type={'number'}
                                name="measurement3"
                                className={'form-control'}
                                value={insData.measurement3}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={'row'}>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>수직변위(+Y)</span>
                                <input
                                    type={'number'}
                                    name="verticalPlus"
                                    className={'form-control'}
                                    value={insData.verticalPlus}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>수직변위(-Y)</span>
                                <input
                                    type={'number'}
                                    name="verticalMinus"
                                    className={'form-control'}
                                    value={insData.verticalMinus}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* 계측기 종류에 따른 추가 필드 */}
                        {['A', 'B', 'C', 'D', 'E', 'F'].includes(insData.insType) && (
                            <div className={'d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>굴착고</span>
                                <input
                                    type={'number'}
                                    name="depExcavation"
                                    className={'form-control'}
                                    value={insData.depExcavation}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                        {['A', 'B', 'C'].includes(insData.insType) && (
                            <div className={'row'}>
                                <div className={'col-sm d-flex flex-column gap-1'}>
                                    <span className={'text-muted small'}>logger</span>
                                    <input
                                        type={'number'}
                                        name="logger"
                                        className={'form-control'}
                                        value={insData.logger}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={'col-sm d-flex flex-column gap-1'}>
                                    <span className={'text-muted small'}>설계변위량</span>
                                    <input
                                        type={'number'}
                                        name="displacement"
                                        className={'form-control'}
                                        value={insData.displacement}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={'d-flex flex-column gap-1'}>
                                    <span className={'text-muted small'}>ZERO_READ</span>
                                    <input
                                        type={'number'}
                                        name="zeroRead"
                                        className={'form-control'}
                                        value={insData.zeroRead}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        )}

                        {['A', 'B'].includes(insData.insType) && (
                            <div className={'d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>1KN_TONE</span>
                                <input
                                    type={'number'}
                                    name="knTone"
                                    className={'form-control'}
                                    value={insData.knTone}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                        {insData.insType === 'B' && (
                            <div className={'d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>허용인장력</span>
                                <input
                                    type={'number'}
                                    name="tenAllowable"
                                    className={'form-control'}
                                    value={insData.tenAllowable}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                        {insData.insType === 'C' && (
                            <div className={'d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>설계긴장력</span>
                                <input
                                    type={'number'}
                                    name="tenDesign"
                                    className={'form-control'}
                                    value={insData.tenDesign}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                        {insData.insType === 'E' && (
                            <div className={'row'}>
                                <div className={'col-sm d-flex flex-column gap-1'}>
                                    <span className={'text-muted small'}>A(+)</span>
                                    <input
                                        type={'number'}
                                        name="aPlus"
                                        className={'form-control'}
                                        value={insData.aPlus}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={'col-sm d-flex flex-column gap-1'}>
                                    <span className={'text-muted small'}>A(-)</span>
                                    <input
                                        type={'number'}
                                        name="aMinus"
                                        className={'form-control'}
                                        value={insData.aMinus}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={'d-flex flex-column gap-1'}>
                                    <span className={'text-muted small'}>B(+)</span>
                                    <input
                                        type={'number'}
                                        name="bPlus"
                                        className={'form-control'}
                                        value={insData.bPlus}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={'d-flex flex-column gap-1'}>
                                    <span className={'text-muted small'}>B(-)</span>
                                    <input
                                        type={'number'}
                                        name="bMinus"
                                        className={'form-control'}
                                        value={insData.bMinus}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        )}

                    </div>
                ) : (
                    <div className={'InsDetail'}>
                        <span className={'text-muted small'}>계측기명</span>
                        <span>{insData.insName}</span>
                        <span className={'text-muted small'}>계측기 관리번호</span>
                        <span>{insData.insNum}</span>
                        <span className={'text-muted small'}>시리얼 NO</span>
                        <span>{insData.insNo}</span>
                        <span className={'text-muted small'}>계측기 종류</span>
                        <span>{insData.insTypeName}</span>
                        <span className={'text-muted small'}>설치 위치</span>
                        <span>{insData.insLocation}</span>
                        <span className={'text-muted small'}>설치일자</span>
                        <span>{insData.createDate}</span>
                        <span className={'text-muted small'}>지오메트리 정보</span>
                        <span>{parseGeometryData(instrument?.insGeometry)}</span>
                        <span className={'text-muted small'}>관리기준치1차</span>
                        <span>{insData.measurement1}</span>
                        <span className={'text-muted small'}>관리기준치2차</span>
                        <span>{insData.measurement2}</span>
                        <span className={'text-muted small'}>관리기준치3차</span>
                        <span>{insData.measurement3}</span>
                        <span className={'text-muted small'}>수직변위(+Y)</span>
                        <span>{insData.verticalPlus}</span>
                        <span className={'text-muted small'}>수직변위(-Y)</span>
                        <span>{insData.verticalMinus}</span>

                        {['A', 'B', 'C', 'D', 'E', 'F'].includes(insData.insType) && (
                            <div className={'InsDetail2'}>
                                <span className={'text-muted small'}>굴착고</span>
                                <span>{insData.depExcavation}</span>
                            </div>
                        )}

                        {['A', 'B', 'C'].includes(insData.insType) && (
                            <div className={'InsDetail2'}>
                                <span className={'text-muted small'}>logger</span>
                                <span>{insData.logger}</span>
                                <span className={'text-muted small'}>설계변위량</span>
                                <span>{insData.displacement}</span>
                                <span className={'text-muted small'}>ZERO_READ</span>
                                <span>{insData.zeroRead}</span>
                            </div>
                        )}

                        {['A', 'B'].includes(insData.insType) && (
                            <div className={'InsDetail2'}>
                                <span className={'text-muted small'}>1KN_TONE</span>
                                <span>{insData.knTone}</span>
                            </div>
                        )}

                        {insData.insType === 'B' && (
                            <div className={'InsDetail2'}>
                                <span className={'text-muted small'}>허용인장력</span>
                                <span>{insData.tenAllowable}</span>
                            </div>
                        )}

                        {insData.insType === 'C' && (
                            <div className={'InsDetail2'}>
                                <span className={'text-muted small'}>설계긴장력</span>
                                <span>{insData.tenDesign}</span>
                            </div>
                        )}

                        {insData.insType === 'E' && (
                            <div className={'InsDetail2'}>
                                <span className={'text-muted small'}>A(+)</span>
                                <span>{insData.aPlus}</span>
                                <span className={'text-muted small'}>A(-)</span>
                                <span>{insData.aMinus}</span>
                                <span className={'text-muted small'}>B(+)</span>
                                <span>{insData.bPlus}</span>
                                <span className={'text-muted small'}>B(-)</span>
                                <span>{insData.bMinus}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className={'projectDetail mt-2'}>
                <button
                    type={'button'}
                    className={'btn qrBtn'}
                    onClick={() => printJS({
                        printable: 'printArea',
                        type: 'html',
                        css: ['/print.css'],
                        targetStyles: ['*'],
                        scanStyles: false,
                    })}
                >
                    QR코드 출력
                </button>
            </div>
            <div className={'printSection'}>
                <table className={'printTable'} id={'printArea'}>
                    <colgroup>
                        <col width={'50%'}/>
                        <col width={'50%'}/>
                    </colgroup>
                    <tbody>
                    <tr>
                        <td>
                            <div className={'qrContainer'}>
                                <span className={'qrTitle'}>
                                    {siteName}
                                </span>
                                <span className={'qrInfo'}>
                                    {`${sectionName} 계측기 : ${insData.insNum}`}
                                </span>
                                <QRCodeCanvas
                                    value={insData.idx}/>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InsDetailSideBar;