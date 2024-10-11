import {useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";

function UserUpdateModal(props) {
    const {isOpen, closeModal, selectUser, userInfo} = props;

    const [id, setId] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [tel, setTel] = useState('');
    const [role, setRole] = useState(0);
    const [company, setCompany] = useState(null);

    // 회사 리스트
    const [companyList, setCompanyList] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:8080/MeausrePro/Company/allCompany/notDelete`)
            .then(res => {
                setCompanyList(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        if (userInfo) {  // userInfo가 존재할 때만 상태 업데이트
            setId(userInfo.id);
            setPass(userInfo.pass);
            setName(userInfo.name);
            setTel(userInfo.tel);
            setRole(userInfo.role);
            setCompany(userInfo.companyIdx);
        }
    }, [userInfo])
    
    // 모달 닫기
    const handleCloseModal = () => {
        selectUser();
        closeModal();
    }

    // 비밀번호 toggle
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    // 비밀번호 형식 유효성 검사
    const [isCheckPw, setIsCheckPw] = useState(true);
    const handleCheckPw = (inputPw) => {
        setPass(inputPw);

        if (inputPw.trim() === '') {
            setPass(null);
            setIsCheckPw(false);
            return;
        }
        if (inputPw.length >= 5 && inputPw.length <= 20) {
            setIsCheckPw(true);
        } else {
            setIsCheckPw(false);
        }
    }
    // 전화번호 포맷팅 및 유효성 검사
    const [isCheckTel, setIsCheckTel] = useState(true);
    const handleCheckTel = (inputTel) => {
        let numTel = inputTel.replace(/[^0-9]/g, '');

        if (numTel.length > 11) {
            numTel = numTel.slice(0, 11);
        }

        let formattedTel = '';
        if (numTel.length <= 3) {
            formattedTel = numTel;
        } else if (numTel.length <= 7) {
            formattedTel = numTel.slice(0, 3) + '-' + numTel.slice(3);
        } else {
            formattedTel = numTel.slice(0, 3) + '-' + numTel.slice(3, 7) + '-' + numTel.slice(7);
        }

        setTel(formattedTel); // 포맷팅된 전화번호를 상태에 설정

        // 전화번호 유효성 검사 (하이픈 포함)
        if (/^010-\d{4}-\d{4}$/.test(formattedTel)) {
            setIsCheckTel(true);
        } else {
            setIsCheckTel(false);
        }
    }

    const handleUserUpdate = (e) => {
        e.preventDefault();

        if (!isCheckPw || !isCheckTel) {
            Swal.fire({
                icon: "info",
                text: `필드값을 모두 입력하세요.`,
                showCancelButton: false,
                confirmButtonText: '확인'
            })
        } else {
            axios.put(`http://localhost:8080/MeausrePro/User/update/${userInfo.idx}`, {
                id: id,
                pass: pass,
                name: name,
                tel: tel,
                role: role,
                companyIdx: company
            })
                .then(res=> {
                    console.log(res);
                    handleCloseModal();
                })
                .catch(err => {
                    console.log(err);
                    Swal.fire({
                        icon: "error",
                        text: `${err.response.data.message}`,
                        showCancelButton: false,
                        confirmButtonText: '확인'
                    })
                })
        }
    }
    
    return (
        <div className={`modal fade ${isOpen ? 'show d-block' : ''}`}
             id={'createUser'}
             tabIndex={'-1'}
             aria-labelledby={'userModalLabel'}
             aria-hidden={!isOpen}
             style={{display: isOpen ? 'block' : 'none'}}
        >
            <div className={'modal-dialog modal-dialog-centered modal-dialog-scrollable'}>
                <div className={'modal-content'}>
                    <div className={'modal-header'}>
                        <span className={'fs-4 modal-title'} id={'userModalLabel'}>
                            회원정보 수정
                        </span>
                        <button type={'button'}
                                className={'btn-close'}
                                data-bs-dismiss={'modal'}
                                aria-label={'Close'}
                                onClick={handleCloseModal}
                        />
                    </div>
                    <div className={'modal-body'}>
                        <div className={'loginSection'}>
                            <form onSubmit={handleUserUpdate} className={'d-grid gap-2'}>
                                <div className={'input-group'}>
                                    <span className={'input-group-text'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                             className="bi bi-person" viewBox="0 0 16 16">
                                                  <path
                                                      d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"></path>
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        className={'form-control'}
                                        placeholder="아이디"
                                        value={id}
                                        required
                                        readOnly
                                    />
                                </div>
                                <div className={'input-group'}>
                                    <span className={'input-group-text'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor"
                                             className="bi bi-lock" viewBox="0 0 16 16">
                                              <path
                                                  d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"/>
                                        </svg>
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={'form-control'}
                                        placeholder="비밀번호"
                                        value={pass}
                                        onChange={(e) => handleCheckPw(e.target.value)}
                                        required
                                    />
                                    <div className={'input-group-text'}>
                                        <button type={'button'}
                                                className={'checkPwBtn'}
                                                onClick={togglePasswordVisibility}>
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor"
                                                     className="bi bi-eye" viewBox="0 0 16 16">
                                                    <path
                                                        d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                                    <path
                                                        d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor"
                                                     className="bi bi-eye-slash" viewBox="0 0 16 16">
                                                    <path
                                                        d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                                                    <path
                                                        d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                                                    <path
                                                        d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className={'ms-3'}>
                                    {isCheckPw === false ? (
                                        <span className={'text-danger'}>5~20자 이내로 입력해주세요.</span>
                                    ) : (
                                        <span className={'text-muted'}>사용 가능한 비밀번호입니다.</span>
                                    )}
                                </div>
                                <div className={'input-group'}>
                                    <span className={'input-group-text'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor"
                                             className="bi bi-info-lg" viewBox="0 0 16 16">
                                            <path
                                                d="m9.708 6.075-3.024.379-.108.502.595.108c.387.093.464.232.38.619l-.975 4.577c-.255 1.183.14 1.74 1.067 1.74.72 0 1.554-.332 1.933-.789l.116-.549c-.263.232-.65.325-.905.325-.363 0-.494-.255-.402-.704zm.091-2.755a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0"/>
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        className={'form-control'}
                                        placeholder="이름"
                                        value={name}
                                        readOnly
                                        required
                                    />
                                </div>
                                <div className={'input-group'}>
                                    <label className={'input-group-text'} htmlFor={'roleSelected'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                                            <path
                                                d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                                        </svg>
                                    </label>
                                    <select className={'form-select'} id={'roleSelected'}
                                            onChange={(e) => setRole(e.target.value)}>
                                        <option value={'0'} selected>관리 (웹)</option>
                                        <option value={'1'}>현장 (앱)</option>
                                    </select>
                                </div>
                                <div className={'input-group'}>
                                    <label className={'input-group-text'}
                                           htmlFor={'companySelected'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-building" viewBox="0 0 16 16">
                                            <path
                                                d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/>
                                            <path
                                                d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z"/>
                                        </svg>
                                    </label>
                                    <select
                                        className={'form-select'}
                                        id={'companySelected'}
                                        value={company ? company.idx : ''}
                                        onChange={(e) => {
                                            const selectedCompany = companyList.find(item => item.idx === parseInt(e.target.value));
                                            setCompany(selectedCompany || null);
                                        }}>
                                        <option value={''} selected>선택하세요</option>
                                        {companyList.map((item) => {
                                            return (
                                                <option value={item.idx} key={item.idx}>
                                                    {item.companyName}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className={'input-group'}>
                                    <span className={'input-group-text'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor"
                                             className="bi bi-telephone"
                                             viewBox="0 0 16 16">
                                          <path
                                              d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        className={'form-control'}
                                        placeholder="전화번호"
                                        value={tel}
                                        onChange={(e) => handleCheckTel(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={'signUpBtn mt-3'}
                                >
                                    수정
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserUpdateModal;