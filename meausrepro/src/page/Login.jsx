import {useState, useContext} from "react";
import axios from "axios";
import UserContext from "../context/UserContext.jsx";
import {useNavigate} from "react-router";

function Login() {
    const [id, setId] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');

    // context 넘길 값
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    // 로그인
    const loginEvent = async (e) => {
        e.preventDefault();

        axios.post(`http://localhost:8080/MeausrePro/User/login`, {
            id: id,
            pass: pass,
            name: '',
            tel: '',
            role: ''
        })
            .then(res => {
                setUser({
                    id: res.data.id,
                    name: res.data.name,
                    tel: res.data.tel,
                    role: res.data.role,
                    pass: res.data.pass
                })
                navigate('/MeausrePro');
            })
            .catch(err=> {
                setError(err);
            })
    }
    // 회원가입 페이지 이동
    const signUpPage = () => {
        navigate('/SignUp')
    }

    // test server login
    const testLogin = () =>
        axios.post(`http://localhost:8080/MeausrePro/User/login`, {
            id: 'test1@gmail.com',
            pass: '1234',
            name: '',
            tel: '',
        })
            .then(res => {
                setUser({
                    id: res.data.id,
                    name: res.data.name,
                    tel: res.data.tel,
                    pass: res.data.pass
                })
                navigate('/MeausrePro');
            })
            .catch(err=> {
                setError(err);
            })

    return (
        <div className={'container d-grid gap-2'}>
            <form onSubmit={loginEvent} className={'d-grid gap-2'}>
                <input
                    type="text"
                    placeholder="아이디"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                />
                <button type={'submit'}
                        className={'btn btn-primary opacity-25'}>
                    로그인
                </button>
                <button type={'button'}
                        className={'btn btn-outline-primary opacity-25'}
                        onClick={signUpPage}>
                    회원가입
                </button>
            </form>
            <button type={'button'} className={'btn btn-success opacity-50'} onClick={testLogin}>
                test
            </button>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
}

export default Login;