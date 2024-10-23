import {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {QRCodeCanvas} from "qrcode.react";
import printJS from "print-js";
import UserContext from "../../context/UserContext.jsx";
import {Link} from "react-router-dom";

function SectionDetailSideBar(props) {
    const { user } = useContext(UserContext);
    const {section, handleSectionUpdated, handleClose, deleteSection} = props;
    const [isOpen, setIsOpen] = useState(false);
    const [reports, setReports] = useState([]); // 리포트 리스트 상태
    const [selectedFile, setSelectedFile] = useState(null); // 파일 상태

    // 이미지 파일 상태
    const [selectedImgFile, setSelectedImgFile] = useState([]);
    // 이미지 리스트
    const [imageList, setImageList] = useState([]);
    const descriptionInputRefs = useRef({});

    // 구간 수정
    const [sectionName, setSectionName] = useState(section.sectionName);
    const [sectionSta, setSectionSta] = useState(section.sectionSta);
    const [wallStr, setWallStr] = useState(section.wallStr);
    const [groundStr, setGroundStr] = useState(section.groundStr);
    const [rearTarget, setRearTarget] = useState(section.rearTarget);
    const [underStr, setUnderStr] = useState(section.underStr);

    // 파일 선택
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // 파일 업로드
    const handleFileUpload = () => {
        if (!selectedFile) {
            Swal.fire("파일을 선택해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('sectionId', section.idx);
        formData.append('userId', user.idx);

        axios.post('http://localhost:8080/MeausrePro/report/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                // 응답 객체에 message가 있을 경우
                if (response.data && response.data.message) {
                    Swal.fire("업로드 성공", response.data.message);
                } else {
                    Swal.fire("업로드 성공", "파일이 정상적으로 업로드되었습니다.");
                }
                fetchReports(); // 리포트 리스트 새로고침
            })
            .catch(error => {
                // 오류 객체에 message가 있을 경우
                if (error.response && error.response.data && error.response.data.message) {
                    Swal.fire("업로드 실패", error.response.data.message);
                } else {
                    Swal.fire("업로드 실패", "파일 업로드 중 오류가 발생했습니다.");
                }
            });
    };

    // 리포트 리스트 불러오기
    const fetchReports = () => {
        axios.get(`http://localhost:8080/MeausrePro/report/reports/${section.idx}`)
            .then(response => {
                setReports(response.data);
            })
            .catch(error => {
                Swal.fire({
                    icon: "error",
                    text: `리포트를 불러오지 못했습니다.`,
                    showCancelButton: false,
                    confirmButtonText: '확인'
                })
                console.log(error);
            });
    }

    // 리포트 다운로드
    const handleDownload = (fileName) => {
        axios.get(`http://localhost:8080/MeausrePro/report/download/${fileName}`, {
            responseType: 'blob'  // 파일 다운로드 시 blob 형태로 받아옴
        })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);  // 파일 다운로드
                document.body.appendChild(link);
                link.click();
            })
            .catch(error => {
                Swal.fire({
                    icon: "error",
                    text: `다운로드 중 오류가 발생했습니다.`,
                    showCancelButton: false,
                    confirmButtonText: '확인'
                })
                console.log(error);
            });
    };

    // 이미지 선택
    const handleImgFileSelect = (e) => {
        const files = Array.from(e.target.files);

        // 파일 정보 객체 형태 저장
        const fileObjects = files.map(file => ({
            file,
            fileName: file.name,
            imgDes: null
        }))
        setSelectedImgFile((prevFiles) => [...prevFiles, ...fileObjects]);

        // 이미지 여러 장 업로드
        fileObjects.forEach((fileObj) => {
            handleSectionUpdateImg(fileObj.file);
        });
    }

    // 사진 추가 버튼 클릭 이벤트
    const handleAddImgClick = () => {
        document.getElementById(`imgInput`).click();
    };

    // 이미지 다운
    const handleImgDownload = async (img) => {
        if(!img || !img.imgSrc) {
            console.error("이미지 정보가 정의되지 않았습니다.");
            return;
        }

        const imgName = img.imgSrc.substring(img.imgSrc.lastIndexOf('/') + 1);
        const downloadUrl = img.imgSrc.toString();

        try {
            const response = await axios.get(downloadUrl, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));

            // 다운로드 링크 생성
            const a = document.createElement('a');
            a.href = url;
            a.download = imgName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // url 해제
            window.URL.revokeObjectURL(url);

        } catch (e) {
            console.log(e);
            Swal.fire({
                icon: "error",
                text: `다운로드 중 오류가 발생했습니다.`,
                showCancelButton: false,
                confirmButtonText: '확인'
            })
        }
    }

    // 이미지 업로드
    const handleSectionUpdateImg = (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const sectionId = section.idx;

        // 이미지 업로드
        axios.post(`http://localhost:8080/MeausrePro/Img/upload/${sectionId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                // 이미지 업로드 성공 후, 응답으로 받은 이미지 URL을 사용
                const uploadedImageUrl = response.data.imgSrc;
                console.log('Image uploaded:', uploadedImageUrl);

                // 이미지 목록에 새로 업로드된 이미지 추가
                setImageList((prevImageList) => [
                    ...prevImageList,
                    { imgSrc: uploadedImageUrl, imgDes: '', idx: response.data.idx  } // 새 이미지 추가
                ]);

                setTimeout(() => {
                    descriptionInputRefs.current[response.data.idx]?.focus();
                }, 100);
            })
            .catch(err => {
                console.log(err);
            });
    }

    // 구간 이미지 리스트 불러오기
    const sectionImgList = () => {
        if (section) {
            axios.get(`http://localhost:8080/MeausrePro/Img/section/${section.idx}`)
                .then((res) => {
                    setImageList(res.data); // 구간 목록 업데이트
                })
                .catch(err => {
                    console.error('구간 이미지 업데이트 중 오류 발생:', err);
                });
        }
    }

    const getImgNameFromUrl = (url) => {
        return url.substring(url.lastIndexOf('/') + 1);
    }
    // 이미지 설명 업데이트
    const updateImgDescription = (imgDes, imgIdx) => {
        return axios.put(`http://localhost:8080/MeausrePro/Img/update`, {
            idx: imgIdx,
            imgDes: imgDes
        });
    }
    // 이미지 설명 관리
    const handleImgDescriptionChange = (e, imgIdx) => {
        const { value } = e.target;

        setImageList((prevList) =>
            prevList.map((image) =>
                image.idx === imgIdx
                    ? { ...image, imgDes: value } // 해당 이미지의 설명 업데이트
                    : image
            )
        );
    }

    // 이미지 설명 업데이트 서버 전송
    const handleImgDescriptionBlur = (imgDes, imgIdx) => {
        updateImgDescription(imgDes, imgIdx)
            .then((res) => {
                console.log(res);
                Swal.fire({
                    icon:"success",
                    text:"이미지 설명을 업데이트 했습니다!",
                    showCancelButton:false,
                    confirmButtonText:"확인"
                })
            })
            .catch(err => {
                console.log(err);

                Swal.fire({
                    icon:"error",
                    text:"이미지 설명 업데이트 중 오류가 발생했습니다.",
                    showCancelButton:false,
                    confirmButtonText:"확인"
                })
            })
    }

    // 이미지 삭제
    const handleImgDelete = (imgIdx) => {
        Swal.fire({
            title: '이미지 삭제',
            text: '이미지를 삭제하시겠습니까?',
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8080/MeausrePro/Img/delete/${imgIdx}`)
                    .then(() => {
                        setImageList(prevList => prevList.filter(image => image.idx !== imgIdx));
                    })
                    .catch(err => {
                        console.log(err);
                        Swal.fire({
                            icon:"error",
                            text:"이미지 삭제 중 오류가 발생했습니다.",
                            showCancelButton:false,
                            confirmButtonText:"확인"
                        })
                    });
            }
        })
    }

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

    useEffect(() => {
        setTimeout(() => {
            setIsOpen(true);
        }, 300);

        // setIsOpen(true);

        fetchInstrumentNumbers();
        sectionImgList();
        fetchReports();  // 컴포넌트가 로드될 때 리포트 리스트 불러오기
    }, [section]);

    // 이미지 리스트 변화 생길때마다
    // useEffect(() => {
    //     if (imageList.length > 0) {
    //         const lastImg = imageList[imageList.length -1];
    //         descriptionInputRefs.current[lastImg.idx]?.focus();
    //
    //         for (let i = 0; i < imageList.length; i++) {
    //             console.log(imageList[i].imgSrc);
    //         }
    //     }
    // }, [imageList]);

    return (
        <div className={`sectionDetailSideBar ${isOpen ? 'open' : ''}`}>
            <div className={'sideBarHeader'}>
                <span className={'projectInfoTitle'}>구간 기본정보</span>
                <div className={'iconBtnSection'}>
                    <button
                        type={'button'}
                        onClick={handleUpdateBtnClick}
                        className={'iconBtn iconBtnGreen'}
                    >
                        {isUpdateBtn ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
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
                        className={'iconBtn iconBtnRed'}
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
                        className={'sideBarCloseBtn iconBtn'}
                        onClick={handleCloseClick}>
                        X
                    </button>
                </div>
            </div>
            {isUpdateBtn ? (
                <div className={'projectInfoContent'}>
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
                    <div className={'row mt-2'}>
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
                    <div className={'row mt-2'}>
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
                    <div className={'row mt-2'}>
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
                    <div className={'row mt-4 d-flex flex-column'}>
                        <div className={'d-flex justify-content-between align-items-center'}>
                            <span className={'projectInfoTitle'}>구간 이미지</span>
                            <button
                                type={'button'}
                                className={'insCreateBtn'}
                                onClick={handleAddImgClick}
                            >
                                이미지 추가
                            </button>
                        </div>
                        <input
                            type={'file'}
                            id={'imgInput'}
                            style={{display: 'none'}}
                            accept={'image/*'}
                            onChange={handleImgFileSelect}
                            multiple
                        />
                        <div className={'mt-3'}>
                            <table className={'table table-sm table-borderless border-0'}>
                                <colgroup>
                                    <col width={'40%'} />
                                    <col width={'60%'} />
                                </colgroup>
                                <thead>
                                <tr className={'border-bottom'}>
                                    <th className={'small'}>파일명</th>
                                    <th className={'small'}>이미지 설명</th>
                                </tr>
                                </thead>
                                <tbody>
                                {imageList.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className={'small'}>
                                            저장된 이미지가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    imageList.map((img, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <input
                                                        type={'text'}
                                                        className={'form-control'}
                                                        value={getImgNameFromUrl(img.imgSrc)}
                                                        disabled
                                                    />
                                                </td>
                                                <td className={'d-flex gap-1'}>
                                                    <input
                                                        ref={(el) => (descriptionInputRefs.current[img.idx] = el)}
                                                        type={'text'}
                                                        className={'form-control'}
                                                        value={img.imgDes}
                                                        onChange={(e) => handleImgDescriptionChange(e, img.idx)}
                                                        onBlur={() => handleImgDescriptionBlur(img.imgDes, img.idx)}
                                                        placeholder={'이미지 설명을 입력하세요.'}
                                                    />
                                                    <button
                                                        className={'iconBtn iconBtnRed'}
                                                        onClick={() => handleImgDelete(img.idx)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                                             height="16"
                                                             fill="currentColor" className="bi bi-trash3"
                                                             viewBox="0 0 16 16">
                                                            <path
                                                                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={'projectInfoSection'}>
                    <div className={'projectInfoHeader'}>
                        <span className={'projectInfoTitle'}>속성</span>
                    </div>
                    <div className={'projectInfoContent mt-3'}>
                        <div className={'row align-items-center'}>
                            <span className={'text-muted small col-sm-5'}>구간명</span>
                            <span className={'col-sm m-0 projectInfoContentTxt'}>
                                {section.sectionName}
                            </span>
                        </div>
                        <div className={'row align-items-center mt-2'}>
                            <span className={'text-muted small col-sm-5'}>구간위치(STA)</span>
                            <span className={'col-sm m-0 projectInfoContentTxt'}>
                                {section.sectionSta}
                            </span>
                        </div>
                        <div className={'row align-items-center mt-2'}>
                            <span className={'text-muted small col-sm-5'}>벽체공</span>
                            <span className={'col-sm m-0 projectInfoContentTxt'}>
                                {section.wallStr}
                            </span>
                        </div>
                        <div className={'row align-items-center mt-2'}>
                            <span className={'text-muted small col-sm-5'}>지지공</span>
                            <span className={'col-sm m-0 projectInfoContentTxt'}>
                                {section.groundStr}
                            </span>
                        </div>
                        <div className={'row align-items-center mt-2'}>
                            <span className={'text-muted small col-sm-5'}>주요관리대상물배면</span>
                            <span className={'col-sm m-0 projectInfoContentTxt'}>
                                {section.rearTarget}
                            </span>
                        </div>
                        <div className={'row align-items-center mt-2'}>
                            <span className={'text-muted small col-sm-5'}>주요관리대상물도로하부</span>
                            <span className={'col-sm m-0 projectInfoContentTxt'}>{section.underStr}</span>
                        </div>
                    </div>
                    <div className={'projectInfoHeader'}>
                        <span className={'projectInfoTitle mt-4'}>출력</span>
                    </div>
                    <div className={'projectInfoContent mt-3'}>
                        <Link to={`/CompAnalysis/${section.idx}`}>
                            <button type={'button'} className={'whiteBtn2'}>
                                종합분석지
                            </button>
                        </Link>
                        <button
                            type={'button'}
                            className={'whiteBtn mt-2'}
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
                    <div className={'projectInfoHeader'}>
                        <span className={'projectInfoTitle mt-2'}>리포트</span>
                    </div>
                    <div className={'projectInfoContent'}>
                        <div className='d-flex flex-column mt-3'>
                            {/* 파일 업로드 버튼 */}
                            <input type={'file'} onChange={handleFileChange} className={'form-control'}/>
                            <div className={'d-grid justify-content-end mt-2'}>
                                <button onClick={handleFileUpload} className={'reportUpBtn'}>
                                    업로드
                                </button>
                            </div>
                        </div>
                        {/* 리포트 리스트 */}
                        <div className={'d-flex flex-column gap-2 mt-2'}>
                            {reports.length > 0 && (
                                reports.map(report => (
                                    <div key={report.idx} className={'reportCard'}>
                                        <div className={'d-flex justify-content-between align-items-center'}>
                                            <div className={'d-flex flex-column gap-1'}>
                                                <span className={'reportTitle'}>
                                                    {report.fileName}
                                                </span>
                                                <span className={'reportUser'}>
                                                    {report.userIdx?.name}
                                                </span>
                                                <span className={'reportDate'}>
                                                    {new Date(report.uploadDate).toLocaleDateString()}
                                                </span> {/* 업로드 날짜 표시 */}
                                            </div>
                                            <button
                                                onClick={() => handleDownload(report.fileName)}
                                                className={'iconBtn iconBtnGreen'}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                     fill="currentColor" className="bi bi-box-arrow-in-down"
                                                     viewBox="0 0 16 16">
                                                    <path fillRule="evenodd"
                                                          d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1z"/>
                                                    <path fillRule="evenodd"
                                                          d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className={'projectInfoHeader'}>
                        <span className={'projectInfoTitle mt-2'}>구간 이미지</span>
                    </div>
                    <div className={'projectInfoContent'}>
                        {/* 이미지 리스트 */}
                        <ul className={'list-unstyled mt-2 d-flex flex-column gap-2'}>
                            {imageList.length > 0 && (
                                imageList.map((img) => (
                                    <li
                                        key={img.idx}
                                        className={'imgCard'}
                                        onClick={() => handleImgDownload(img)}
                                    >
                                        <img
                                            src={img.imgSrc}
                                            alt={img.name}
                                            className={'img-fluid'}
                                            style={{
                                                width: '50px',
                                                height: '35px',
                                                transition: 'transform 0.2s'
                                            }}
                                        />
                                        <div className={'d-flex flex-column text-end gap-1'}>
                                            <span className={'text-muted small'}>
                                                {getImgNameFromUrl(img.imgSrc)}
                                            </span>
                                            <span className={'imgText'}>
                                                {img.imgDes}
                                            </span>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            )}
            <div className={'printSection'}>
                <table className={'printTable'} id={'printArea'}>
                    <colgroup>
                        <col width={'50%'}/>
                        <col width={'50%'}/>
                    </colgroup>
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
                                        <QRCodeCanvas value={`${instrument.idx}`}/>
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
                                                value={`${instrumentNumbers[index + 1].idx}`}/>
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