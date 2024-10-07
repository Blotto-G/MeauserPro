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
        <div className={'container d-grid border shadow-lg'} style={{justifyContent: 'center',
        alignItems: 'center', marginLeft: '500px', paddingTop: '90px', paddingBottom: '90px' ,borderRadius: '20px'}}>
            <div>
                <form onSubmit={loginEvent} className={'d-grid gap-2'} style={{width: '300px'}}>
                    <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center'}}>계측관리시스템 로그인</h2>
                    <hr/>
                    <input
                        type="text"
                        className={"form-control mb-2"}
                        style={{backgroundColor: '#f4f4f4'}}
                        placeholder="아이디"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    <input
                        type="password"
                        className={"form-control mb-2"}
                        style={{backgroundColor: '#f4f4f4'}}
                        placeholder="비밀번호"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                    />
                    <button type={'submit'}
                            className={'btn btn-primary opacity-25 mb-2'}>
                        로그인
                    </button>
                    <button type={'button'}
                            className={'btn btn-outline-primary opacity-25 mb-2'}
                            onClick={signUpPage}>
                        회원가입
                    </button>
                </form>
                <button type={'button'} className={'btn btn-success opacity-50 mt-2'} onClick={testLogin}
                style={{width: '100%'}}>
                    test
                </button>
                {error && <p style={{color: 'red'}}>{error}</p>}

            </div>
        </div>
    );
}

export default Login;