import { Link, useLocation } from 'react-router-dom';
import {useContext, useEffect, useState} from "react";
import './Sidebar.css'
import UserContext from "../../context/UserContext.jsx";
import {useNavigate} from "react-router";

function CustomSidebar(props) {
    const { topManager } = props;
    const location = useLocation();
    const navigate = useNavigate();

    // 회원 관리 dropDown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    // 로그아웃
    const { setUser } = useContext(UserContext);
    const handleLogOut = () => {
        setUser(null);
        localStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/');
    };

    // 회원정보관리, 작업그룹관리 페이지에서는 드롭다운 open 유지
    useEffect(() => {
        const dropdownPaths = ['/UserManagement', '/GroupManagement'];

        if (dropdownPaths.includes(location.pathname)) {
            setIsDropdownOpen(true);
        } else {
            setIsDropdownOpen(false);
        }
    }, [location.pathname]);

    return (
        <div className={'customSideBar'}>
            <div className={'customSideBarList'}>
                <span className={'customSideBarTitle'}>
                    MeasurePro
                </span>
                <Link
                    to="/MeausrePro"
                    className={`text-decoration-none`}
                >
                    <div className={`customSideBarLink ${location.pathname === '/MeausrePro' ? 'active' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-house" viewBox="0 0 16 16">
                            <path
                                d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
                        </svg>
                        <span>메인</span>
                    </div>
                </Link>
                <Link
                    to="/Report"
                    className={`text-decoration-none`}
                >
                    <div className={`customSideBarLink ${location.pathname === '/Report' ? 'active' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-printer" viewBox="0 0 16 16">
                            <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                            <path
                                d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1"/>
                        </svg>
                        <span>Report</span>
                    </div>
                </Link>
                {topManager === '1' && (<div>
                        <div
                            className={`customSideBarLink  ${
                                location.pathname.startsWith('/UserManagement') ||
                                location.pathname.startsWith('/GroupManagement') ? 'active' : ''}`}
                            onClick={toggleDropdown}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-people" viewBox="0 0 16 16">
                                <path
                                    d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                            </svg>
                            <span>회원관리</span>
                            {isDropdownOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                                     className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                    <path
                                        d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                                     className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                    <path
                                        d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                </svg>
                            )}
                        </div>
                        <div className={`dpContent ${isDropdownOpen ? 'open' : ''}`}>
                            <div>
                                <Link
                                    to="/UserManagement"
                                    className={`customSideBarLink text-decoration-none ${
                                        location.pathname === '/UserManagement' ? 'active' : ''
                                    }`}>
                                    회원정보관리</Link>
                            </div>
                            <div>
                                <Link
                                    to="/GroupManagement"
                                    className={`customSideBarLink text-decoration-none ${
                                        location.pathname === '/GroupManagement' ? 'active' : ''
                                    }`}>
                                    작업그룹 관리</Link>
                            </div>
                        </div>
                    </div>
                )}
                <Link to={'/ProjectManagement'}
                      className={'text-decoration-none'}>
                    <div className={`customSideBarLink ${location.pathname === '/ProjectManagement' ? 'active' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-journals" viewBox="0 0 16 16">
                            <path
                                d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2 2 2 0 0 1-2 2H3a2 2 0 0 1-2-2h1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1H1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2"/>
                            <path
                                d="M1 6v-.5a.5.5 0 0 1 1 0V6h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V9h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 2.5v.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H2v-.5a.5.5 0 0 0-1 0"/>
                        </svg>
                        <span>프로젝트 관리</span>
                    </div>
                </Link>
            </div>
            <button className={'customSideBarBtn'} onClick={handleLogOut}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                          d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                    <path fillRule="evenodd"
                          d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                </svg>
                <span>
                    LogOut
                </span>
            </button>
        </div>
    );
}

export default CustomSidebar;