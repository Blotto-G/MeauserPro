import {useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {QRCodeCanvas} from "qrcode.react";
import printJS from "print-js";

function SectionDetailSideBar(props) {
    const {section, handleSectionUpdated, handleClose, deleteSection} = props;
    const [isOpen, setIsOpen] = useState(false);

    // 구간 수정
    const [sectionName, setSectionName] = useState(section.sectionName);
    const [sectionSta, setSectionSta] = useState(section.sectionSta);
    const [wallStr, setWallStr] = useState(section.wallStr);
    const [groundStr, setGroundStr] = useState(section.groundStr);
    const [rearTarget, setRearTarget] = useState(section.rearTarget);
    const [underStr, setUnderStr] = useState(section.underStr);

    // qr 출력
    const [instrumentNumbers, setInstrumentNumbers] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchInstrumentNumbers = () => {
        axios.get(`http://localhost:8080/MeausrePro/Instrument/section/${section.idx}`)
            .then((res) => {
                console.log("API 응답 데이터:", res); // 응답 전체를 확인
                const data = res.data; // res.data로 변경해서 응답을 확인
                if (Array.isArray(data)) {
                    setInstrumentNumbers(data); // 데이터가 배열인 경우 계측기 번호 설정
                } else {
                    console.error("잘못된 데이터 형식:", data);
                }
            })
            .catch((err) => {
                console.error("API 호출 에러:", err);
            })
            .finally(() => {
                setIsLoading(false); // 로딩 종료
            });
    };

    // 수정 버튼 클릭 (클릭 전 값 = false)
    const [isUpdateBtn, setIsUpdateBtn] = useState(false);

    useEffect(() => {
        setIsOpen(true);
        // 계측기 번호 가져오기
        fetchInstrumentNumbers();
    }, []);

    const handleUpdateBtnClick = () => {
        if (!isUpdateBtn) {
            setIsUpdateBtn(!isUpdateBtn);
        } else {
            updateSection();
        }
    };
    // 구간 수정
    const updateSection = () => {
        axios.put(`http://localhost:8080/MeausrePro/Section/update`, {
            idx: section.idx,
            projectId: section.projectId,
            sectionName: sectionName,
            sectionSta: sectionSta,
            wallStr: wallStr,
            rearTarget: rearTarget,
            underStr: underStr,
            groundStr: groundStr,
            repImg: section.repImg
        })
            .then(res => {
                console.log(res);
                setIsUpdateBtn(!isUpdateBtn);
                const updatedSection = {
                    ...section,
                    sectionName,
                    sectionSta,
                    wallStr,
                    groundStr,
                    rearTarget,
                    underStr
                };
                handleSectionUpdated(updatedSection);
            })
            .catch(err => {
                console.log(err);
            })
    }

    // 닫기버튼
    const handleCloseClick = () => {
        if (!isUpdateBtn) {
            setIsOpen(false);
            // 애니메이션이 끝난 후 실제로 사이드바를 닫음
            setTimeout(() => {
                handleClose();
            }, 300);
        } else {
            setIsUpdateBtn(false);
        }
    };

    // 구간 삭제 처리
    const handleDeleteClick = () => {
        Swal.fire({
            title: '구간 삭제',
            text: "이 구간을 삭제하시겠습니까?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSection(section.idx);
                handleCloseClick(); // 삭제 후 사이드바 닫기
            }
        });
    };
    return (
        <div className={`sectionDetailSideBar ${isOpen ? 'open' : ''}`}>
            <div className={'sideBarHeader'}>
                <span className={'fw-bold sectionSideBarTitle'}>구간 기본정보</span>
                <div className={'d-flex gap-2'}>
                    <button
                        type={'button'}
                        onClick={handleUpdateBtnClick}
                        className={'sideBarBtn projectUpdate'}
                    >
                        {isUpdateBtn ? (
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
                        onClick={handleDeleteClick}
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
                {isUpdateBtn ? (
                    <div className={'projectDetail'}>
                        <div className={'row'}>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>구간명</span>
                                <input
                                    type={'text'}
                                    className={'form-control'}
                                    value={sectionName}
                                    onChange={(e) => setSectionName(e.target.value)}
                                />
                            </div>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>구간위치(STA)</span>
                                <input
                                    type={'text'}
                                    className={'form-control'}
                                    value={sectionSta}
                                    onChange={(e) => setSectionSta(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>벽체공</span>
                                <input
                                    type={'text'}
                                    className={'form-control'}
                                    value={wallStr}
                                    onChange={(e) => setWallStr(e.target.value)}
                                />
                            </div>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>지지공</span>
                                <input
                                    type={'text'}
                                    className={'form-control'}
                                    value={groundStr}
                                    onChange={(e) => setGroundStr(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>주요관리대상물배면</span>
                                <input
                                    type={'text'}
                                    className={'form-control'}
                                    value={rearTarget}
                                    onChange={(e) => setRearTarget(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>주요관리대상물도로하부</span>
                                <input
                                    type={'text'}
                                    className={'form-control'}
                                    value={underStr}
                                    onChange={(e) => setUnderStr(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={'projectDetail'}>
                        <span className={'fw-bold sectionSideBarText my-2'}>속성</span>
                        <div className={'row align-items-center'}>
                            <span className={'text-muted small col-sm-5'}>구간명</span>
                            <span className={'col-sm'}>{section.sectionName}</span>
                        </div>
                        <div className={'row align-items-center'}>
                            <span className={'text-muted small col-sm-5'}>구간위치(STA)</span>
                            <span className={'col-sm'}>{section.sectionSta}</span>
                        </div>
                        <div className={'row align-items-center'}>
                            <span className={'text-muted small col-sm-5'}>벽체공</span>
                            <span className={'col-sm'}>{section.wallStr}</span>
                        </div>
                        <div className={'row align-items-center'}>
                            <span className={'text-muted small col-sm-5'}>지지공</span>
                            <span className={'col-sm'}>{section.groundStr}</span>
                        </div>
                        <div className={'row align-items-center'}>
                            <span className={'text-muted small col-sm-5'}>주요관리대상물배면</span>
                            <span className={'col-sm'}>{section.rearTarget}</span>
                        </div>
                        <div className={'row align-items-center'}>
                            <span className={'text-muted small col-sm-5'}>주요관리대상물도로하부</span>
                            <span className={'col-sm'}>{section.underStr}</span>
                        </div>
                        <hr/>
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
                            disabled={isLoading} // 로딩 중이면 버튼 비활성화
                        >
                            {isLoading ? "로딩 중..." : "QR코드 일괄출력"}
                        </button>
                    </div>
                )}
            </div>
            <div className={'printSection'}>
                <table className={'printTable'} id={'printArea'}>
                    <tbody>
                    {instrumentNumbers.map((instrument, index) => (
                        index % 2 === 0 && (
                            <tr key={index} className={index % 4 === 0 && index !== 0 ? 'page-break' : ''}>
                                <td>
                                    <div className={'qrContainer'}>
                                        <span className={'qrTitle'}>
                                                {section.projectId.siteName}
                                        </span>
                                        <span className={'qrInfo'}>
                                                {`${section.sectionName} 계측기 : ${instrumentNumbers[index].insNum}`}
                                        </span>
                                        <QRCodeCanvas value={`Instrument Number: ${instrument.idx}`}/>
                                    </div>
                                </td>
                                {instrumentNumbers[index + 1] && (
                                    <td>
                                        <div className={'qrContainer'}>
                                            <span className={'qrTitle'}>
                                                {section.projectId.siteName}
                                            </span>
                                            <span className={'qrInfo'}>
                                                {`${section.sectionName} 계측기 : ${instrumentNumbers[index + 1].insNum}`}
                                            </span>
                                            <QRCodeCanvas
                                                value={`Instrument Number: ${instrumentNumbers[index + 1].idx}`}/>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        )
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SectionDetailSideBar;