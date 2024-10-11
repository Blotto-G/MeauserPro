import {useState, useContext} from "react";
import axios from "axios";
import UserContext from "../context/UserContext.jsx";
import {useNavigate} from "react-router";
import Swal from "sweetalert2";

function Login() {
    const [id, setId] = useState('');
    const [pass, setPass] = useState('');

    // context 넘길 값
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    // 로그인
    const loginEvent = async (e) => {
        e.preventDefault();
        if (!id || !pass) {
            Swal.fire({
                icon: 'error',
                text: '아이디와 비밀번호를 입력해주세요.',
                showCancelButton: false,
                confirmButtonText: '확인'
            })
            return;
        }

        axios.post(`http://localhost:8080/MeausrePro/User/login`, {
            idx: 1,
            id: id,
            pass: pass,
            name: '',
            tel: '',
            role: '',
            topManager: ''
        })
            .then(res => {
                setUser({
                    idx: res.data.idx,
                    id: res.data.id,
                    pass: res.data.pass,
                    name: res.data.name,
                    tel: res.data.tel,
                    role: res.data.role,
                    topManager: res.data.topManager
                })
                navigate('/MeausrePro');
            })
            .catch(err => {
                Swal.fire({
                    icon: "warning",
                    text: `${err.response.data.message}`,
                    showCancelButton: false,
                    confirmButtonText: '확인'
                })
                setPass('');
            })
    }

    // test server login
    const testLogin = () => axios.post(`http://localhost:8080/MeausrePro/User/webLogin`, {
        idx: 1,
        id: 'test1@gmail.com',
        pass: '1234',
        name: '',
        tel: '',
        role: '',
        topManager: ''
    })
        .then(res => {
            setUser({
                idx: res.data.idx,
                id: res.data.id,
                pass: res.data.pass,
                name: res.data.name,
                tel: res.data.tel,
                role: res.data.role,
                topManager: res.data.topManager
            })
            navigate('/MeausrePro');
        })
        .catch(err => {
            Swal.fire({
                icon: "error",
                text: `${err.response.data.message}`,
                showCancelButton: false,
                confirmButtonText: '확인'
            })
        })

    return (
        <div className={'loginBackground'}>
            <div className={'loginSection'}>
                <span className={'fs-3 fw-bold'}>
                    MeausrePro
                </span>
                <span className={'fs-6'}>
                    보다 정확한, 계측관리시스템
                </span>
                <form onSubmit={loginEvent} className={'mt-3 d-grid gap-2'}>
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
                            onChange={(e) => setId(e.target.value)}
                        />
                    </div>
                    <div className={'input-group'}>
                        <span className={'input-group-text'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-lock" viewBox="0 0 16 16">
                                  <path
                                      d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"/>
                            </svg>
                        </span>
                        <input
                            type="password"
                            className={'form-control'}
                            placeholder="비밀번호"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                        />
                    </div>
                    <button type={'submit'}
                            className={'btn greenBtn'}>
                        로그인
                    </button>
                </form>
                <button type={'button'} className={'btn btn-success opacity-50'} onClick={testLogin}>
                    test
                </button>
            </div>
        </div>
    );
}

export default Login;