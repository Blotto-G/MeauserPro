import {Link, useLocation} from "react-router-dom";

function NavBar(props) {
    const location = useLocation();

    const { topManager } = props;

    return (
        <div className={"sidebar"}
             style={{ backgroundColor: '#f4f4f4', height: '100vh', width: '250px',
                 display: 'flex', flexDirection: 'column', }}>
            <div className={"sidebarWrapper"}>
                <div className={"sidebarMenu"}>
                    <ul className={"sidebarList"}>
                        <li className={"sidebarListItem mt-4"}
                            style={{ display: 'flex', alignItems: 'center', marginBottom: '15px',
                                backgroundColor: location.pathname === "/MeausrePro" ? "#e0e0e0" : "transparent"}}>
                            <img src="/src/assets/images/660026.png" alt=""
                                 style={{width: '30px', marginRight: '10px'}}/>
                            <Link to={'/MeausrePro'} style={{textDecoration: 'none', color: 'black'}}>메인</Link>
                        </li>
                        <li className={"sidebarListItem mt-2"}
                            style={{ display: 'flex', alignItems: 'center', marginBottom: '15px',
                                backgroundColor: location.pathname === "/report" ? "#e0e0e0" : "transparent"}}>
                            <img src="/src/assets/images/pngtree-printer-icon-png-image_1817556.jpg" alt=""
                                 style={{width: '35px', marginRight: '10px'}}/>
                            <Link to={'/report'} style={{textDecoration: 'none', color: 'black'}}>리포트</Link>
                        </li>
                        {topManager === '1' && (
                            <li className={"sidebarListItem mt-2"}
                                style={{display: 'flex', alignItems: 'center', marginBottom: '15px',
                                    backgroundColor: location.pathname === "/UserManagement" ? "#e0e0e0" : "transparent"}}>
                                <img src="/src/assets/images/sm_5afc48f016664.jpg" alt=""
                                     style={{width: '35px', marginRight: '10px'}}/>
                                <Link to={'/UserManagement'} style={{textDecoration: 'none', color: 'black'}}>회원 관리</Link>
                            </li>
                        )}
                        <li className={"sidebarListItem mt-2"}
                            style={{display: 'flex', alignItems: 'center', marginBottom: '15px',
                                backgroundColor: location.pathname === "/system" ? "#e0e0e0" : "transparent"}}>
                            <img src="/src/assets/images/1827737.png" alt=""
                                 style={{width: '30px', marginRight: '10px'}}/>
                            <Link to={'/system'} style={{textDecoration: 'none', color: 'black'}}>시스템 관리</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NavBar;