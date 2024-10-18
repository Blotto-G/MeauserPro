import {useEffect, useRef, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {QRCodeCanvas} from "qrcode.react";
import printJS from "print-js";
import {Link} from "react-router-dom";

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
    }, [section]);

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
                console.log("Section updated:", res.data);
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



    const [selectedFiles, setSelectedFiles] = useState([]);
    // const [imageDes, setImageDes] = useState(null);
    const [imageList, setImageList] = useState([]);
    const descriptionInputRefs = useRef({});

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);

        // 파일 정보를 객체 형태로 저장
        const fileObjects = files.map(file => ({
            file,
            fileName: file.name, // 파일 이름
            imgDes: null // 이미지 설명 초기화
        }));

        setSelectedFiles((prevFiles) => [...prevFiles, ...fileObjects]);

        // 여러 파일 업로드 처리
        fileObjects.forEach((fileObj) => {
            handleSectionUpdateWithImage(fileObj.file); // 각 파일을 업로드
        });
    };

    // 사진 추가 버튼 클릭 시 숨겨진 파일 input 요소 클릭을 트리거
    const handleAddPhotoClick = () => {
        document.getElementById('fileInput').click();
    };


    // 이미지 다운로드 핸들러
    const handleDownload = async (image) => {
        if (!image || !image.imgSrc) {
            console.error("이미지 정보가 정의되지 않았습니다.");
            return; // 이미지 정보가 정의되지 않았을 경우 조기 반환
        }

        // imgSrc에서 파일 이름 추출
        const fileName = image.imgSrc.substring(image.imgSrc.lastIndexOf('/') + 1);

        const downloadUrl = image.imgSrc.toString();
        // const downloadUrl = `http://localhost:8080/MeausrePro/Img/download/${encodeURIComponent(fileName)}`;

        try {
            const response = await axios.get(downloadUrl, {
                responseType: 'blob', // 응답 타입을 blob으로 설정
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("파일 다운로드 중 오류가 발생했습니다:", error);
        }
    };


    const handleSectionUpdateWithImage = (file) => {
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
    };

    // 미리보기를 업데이트하는 함수
    // const updateImagePreview = (imageUrl) => {
    //     const imgElement = document.getElementById('imagePreview');
    //     imgElement.src = imageUrl;  // 이미지 URL로 미리보기 표시
    //     imgElement.style.display = 'block';  // 미리보기 보이기
    // };

    const sectionImageList = () => {
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

    useEffect(() => {
        sectionImageList();
    }, [section]); // section이 변경될 때마다 호출

    const getFileNameFromUrl = (url) => {
        return url.substring(url.lastIndexOf('/') + 1);
    };

    // 이미지 설명 업데이트 함수
    const updateImageDescription = (imgDes, imgIdx) => {
        return axios.put(`http://localhost:8080/MeausrePro/Img/update`, {
            idx: imgIdx, // 적절한 이미지 식별자
            imgDes: imgDes
        });
    };

    // input에서 입력한 설명을 관리하는 함수
    const handleImageDescriptionChange = (e, imgIdx) => {
        const { value } = e.target;

        setImageList((prevList) =>
            prevList.map((image) =>
                image.idx === imgIdx
                    ? { ...image, imgDes: value } // 해당 이미지의 설명 업데이트
                    : image
            )
        );
    };

    // 설명 업데이트를 서버로 전송하는 함수 (onBlur 이벤트로 호출)
    const handleDescriptionBlur = (imgDes, imgIdx) => {
        updateImageDescription(imgDes, imgIdx)
            .then((response) => {
                console.log('설명 업데이트 성공:', response);
            })
            .catch((error) => {
                console.error('설명 업데이트 중 오류가 발생했습니다:', error);
            });
    };

    useEffect(() => {
        if (imageList.length > 0) {
            const lastImage = imageList[imageList.length - 1];
            descriptionInputRefs.current[lastImage.idx]?.focus();
        }
    }, [imageList]);

    // 이미지 삭제 처리
    const handleImgDelete = (imgIdx) => {
        Swal.fire({
            title: '이미지 삭제',
            text: "이 이미지를 삭제하시겠습니까?",
            icon: 'warning',
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
                        console.error("구간 삭제 중 오류 발생:", err);
                    });
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
                        <hr/>
                        <div className={'d-flex flex-column'}>
                            <span className={'fw-bold sectionSideBarText my-2'}>사진</span>
                            <button
                                type={'button'}
                                className={'btn btn-outline-success mt-2'}
                                onClick={handleAddPhotoClick}
                            >
                                +사진추가
                            </button>
                            <input
                                type="file"
                                id="fileInput"
                                style={{display: 'none'}}
                                accept="image/*"
                                onChange={handleFileSelect}
                                multiple
                            />
                            <div className={'mt-3'}>
                                <table className={'table text-center table-hover'} style={{verticalAlign: 'middle'}}>
                                    <thead>
                                    <tr>
                                        <th style={{width: '40%'}}>파일명</th>
                                        <th style={{width: '60%'}}>이미지 설명</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {imageList.length === 0 ? (
                                        <tr>
                                            <td colSpan={2}>출력할 내용이 없습니다.</td>
                                        </tr>
                                    ) : (
                                        imageList.map((image, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={getFileNameFromUrl(image.imgSrc)}
                                                            disabled
                                                        />
                                                    </td>
                                                    <td className={'d-flex'}>
                                                        <input
                                                            ref={(el) => (descriptionInputRefs.current[image.idx] = el)}
                                                            type="text"
                                                            className="form-control"
                                                            value={image.imgDes}
                                                            onChange={(e) => handleImageDescriptionChange(e, image.idx)} // 입력 값 변경 시 상태 업데이트
                                                            onBlur={() => handleDescriptionBlur(image.imgDes, image.idx)}
                                                            placeholder={'이미지를 설명하세요'}
                                                        />
                                                        <button
                                                            className={'sideBarBtn projectDelete ms-2'}
                                                            onClick={handleImgDelete}
                                                        >
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
                                        }))
                                    }
                                    </tbody>
                                </table>
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
                        <Link to={"/Report"}>
                            <div>
                                <button type={"button"} className={"btn rpBtn"}>종합분석지</button>
                            </div>
                        </Link>
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
                        <hr/>
                        <span className={'fw-bold sectionSideBarText mt-2'}>사진</span>
                        <ul className={'image-preview-section mt-2 list-unstyled'}>
                            {imageList.length === 0 ? (
                                <li>업로드된 이미지가 없습니다.</li>
                            ) : (
                                imageList.map((image) => {
                                    return (
                                        <li key={image.idx}
                                            className={'d-flex flex-column align-items-start w-100 text-center text-dark ps-2 py-2 mb-2 rounded-3'}
                                            style={{cursor: 'pointer', background: '#f7f7f7'}}
                                            onClick={() => handleDownload(image)}>
                                            <img
                                                src={image.imgSrc}
                                                alt={image.name} // 이미지의 설명 표시
                                                className={'me-2'}
                                                style={{
                                                    width: '50px',
                                                    height: '35px',
                                                    transition: 'transform 0.2s'
                                                }} // 미리보기 이미지 크기
                                            />
                                            <div className={'text-start'}>
                                                <span
                                                    className={'text-muted small col-sm-5'}>{getFileNameFromUrl(image.imgSrc)}</span>
                                                <br/>
                                                <span className={'text-muted small col-sm-5'}>{image.imgDes}</span>
                                            </div>
                                        </li>
                                    )
                                }))
                            }
                        </ul>

                    </div>
                )}
            </div>
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
                                        <QRCodeCanvas value={instrument.idx}/>
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
                                                value={instrumentNumbers[index + 1].idx}/>
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