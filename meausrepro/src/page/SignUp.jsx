import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const [id, setId] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [tel, setTel] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // 아이디 중복 확인
    const [isCheckId, setIsCheckId] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const registerEvent = async (e) => {
        e.preventDefault();

        axios.post(`http://localhost:8080/MeausrePro/User/SignUp`, {
            id: id,
            pass: pass,
            name: name,
            tel: tel
        })
            .then(res => {
                console.log(res);
                navigate('/'); // 회원가입 후 홈으로 이동
            })
            .catch(err => {
                console.log(err);
                setError("회원가입에 실패했습니다."); // 더 구체적인 에러 메시지
            });
    };

    // 아이디 중복 확인
    const handleCheckId = () => {

        axios.post(`http://localhost:8080/MeausrePro/User/checkId/${id}`) // 중복된 슬래시 제거
            .then(res => {
                console.log(res);
                const { data } = res;
                setIsCheckId(data);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const goToLogin = () => {
        navigate('/'); // 로그인 페이지로 이동
    };

    return (
        <div className={'container d-grid gap-2'}>
            <form onSubmit={registerEvent} className={'d-grid gap-2'}>
                <input
                    type="text"
                    placeholder="아이디"
                    value={id}
                    onChange={(e) => setId(e.target.value)} />
                <button type={'button'} className={'btn btn-outline-primary'} onClick={handleCheckId()}>
                    아이디 중복 체크
                </button>
                <span>
                    {isCheckId ? '사용 가능한 아이디입니다.' : '사용할 수 없는 아이디입니다.'}
                </span>
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                />
                <button type="button" onClick={togglePasswordVisibility}>
                    {showPassword ? "숨기기" : "보기"}
                </button>
                <input
                    type="text"
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="전화번호"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    required
                />
                <button type={'submit'} className={'btn btn-primary'} disabled={isCheckId === false}>회원가입</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className={'d-grid gap-2'}>
                <button onClick={goToLogin} className={'btn btn-secondary'}>로그인 페이지로 가기</button>
            </div>
        </div>
    );
}

export default SignUp;
