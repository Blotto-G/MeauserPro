import {useNavigate} from "react-router";
import {useContext, useState} from "react";
import UserContext from "../context/UserContext.jsx";

function Header() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [isUser, setIsUser] = useState(user);

    const handleLogout = () => {
        setIsUser(null);
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <div className={'header'}>
            <span className={'fs-5'}>계측관리시스템</span>
            {isUser && (
                <div>
                    <button className={"btn btn-light"} onClick={handleLogout}>로그아웃</button>
                </div>
            )}
        </div>
    )
}

export default Header;