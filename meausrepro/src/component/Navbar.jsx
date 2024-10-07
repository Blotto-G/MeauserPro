import {useNavigate} from "react-router";
import {useContext} from "react";
import UserContext from "../context/UserContext.jsx";

function Navbar() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <div className={"navbar"} style={{display: 'flex', justifyContent: 'space-between', height: "80px"}}>
            <div className={"p-3"}>
                <h2>계측관리시스템</h2>
            </div>
            {user && (
                <div>
                    <button className={"btn btn-outline-dark"} onClick={handleLogout}>로그아웃</button>
                </div>
            )}
        </div>
    )
}

export default Navbar;