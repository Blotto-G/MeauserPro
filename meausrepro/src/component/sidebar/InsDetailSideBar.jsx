import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function InsDetailSideBar(props) {
    const { instrument, handleClose, onInstrumentUpdated, deleteInstrument, insGeometryData} = props;
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [insName, setInsName] = useState(instrument?.insName || "");
    const [insType, setInsType] = useState(instrument?.insType || "");
    const [insLocation, setInsLocation] = useState(instrument?.insLocation || "");
    const [status, setStatus] = useState(instrument?.status || "");

    // 추가 필드 상태 관리
    const [verticalPlus, setVerticalPlus] = useState(instrument?.verticalPlus || 0);
    const [verticalMinus, setVerticalMinus] = useState(instrument?.verticalMinus || 0);
    const [measurement1, setMeasurement1] = useState(instrument?.measurement1 || 0);
    const [measurement2, setMeasurement2] = useState(instrument?.measurement2 || 0);
    const [measurement3, setMeasurement3] = useState(instrument?.measurement3 || 0);

    useEffect(() => {
        setIsOpen(true);
    }, []);

    // 닫기 처리
    const handleCloseClick = () => {
        setIsOpen(false);
        setTimeout(() => {
            handleClose();
        }, 300);
    };

    // 수정 모드 토글
    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    // 수정된 데이터 저장
    const saveChanges = () => {
        axios.put(`http://localhost:8080/MeausrePro/Instrument/update`, {
            idx: instrument.idx,
            insName,
            insType,
            insLocation,
            status,
            verticalPlus,
            verticalMinus,
            measurement1,
            measurement2,
            measurement3
        })
            .then((res) => {
                onInstrumentUpdated(res.data); // 업데이트된 정보 반영
                toggleEdit(); // 수정 모드 종료
            })
            .catch((err) => {
                console.error("계측기 수정 중 오류 발생:", err);
            });
    };

    // 계측기 삭제
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
                deleteInstrument(instrument.idx); // 삭제 함수 호출
            }
        });
    };

    return (
        <div className={`insDetailSideBar ${isOpen ? 'open' : ''}`}>
            <div className={'sideBarHeader'}>
                <span className={'fw-bold sectionSideBarTitle'}>계측기 상세 정보</span>
                <div className={'d-flex gap-2'}>
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
                                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"
                            />
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
                <div className={'projectDetail'}>
                    <span className={'text-muted small'}>계측기 이름</span>
                    <span>{instrument?.insName || "정보 없음"}</span>

                    <span className={'text-muted small'}>계측기 유형</span>
                    <span>{instrument?.insType || "정보 없음"}</span>

                    <span className={'text-muted small'}>설치 위치</span>
                    <span>{instrument?.insLocation || "정보 없음"}</span>

                    <span className={'text-muted small'}>상태</span>
                    <span>{instrument?.status || "정보 없음"}</span>

                    <span className={'text-muted small'}>설치일</span>
                    <span>{instrument?.installDate || "정보 없음"}</span>

                    <span className={'text-muted small'}>지오메트리정보</span>
                    <span>{insGeometryData || "정보 없음"}</span>

                    {/* 계측기 타입에 따른 추가 정보 표시 */}
                    {['하중계_버팀대', '하중계_PSBEAM', '하중계_앵커'].includes(instrument?.insType) && (
                        <div className={'additionalDetails'}>
                            <span className={'text-muted small'}>수직변위(+Y)</span>
                            <span>{instrument?.verticalPlus || "정보 없음"}</span>
                            <span className={'text-muted small'}>수직변위(-Y)</span>
                            <span>{instrument?.verticalMinus || "정보 없음"}</span>
                        </div>
                    )}

                    {['지중경사계', '지하수위계', '간극수압계'].includes(instrument?.insType) && (
                        <div className={'additionalDetails'}>
                            <span className={'text-muted small'}>측정값1</span>
                            <span>{instrument?.measurement1 || "정보 없음"}</span>
                            <span className={'text-muted small'}>측정값2</span>
                            <span>{instrument?.measurement2 || "정보 없음"}</span>
                            <span className={'text-muted small'}>측정값3</span>
                            <span>{instrument?.measurement3 || "정보 없음"}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InsDetailSideBar;
