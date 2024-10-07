import {Link, useLocation} from "react-router-dom";

function NavBar() {
    const location = useLocation();

    return (
        <div className={"sidebar"}
             style={{ backgroundColor: '#f4f4f4', height: '100vh', width: '250px',
                 display: 'flex', flexDirection: 'column', }}>
            <div className={"sidebarWrapper"}>
                <div className={"sidebarMenu"}>
                    <ul className={"sidebarList"}>
                        <li className={"sidebarListItem mt-4"}
                            style={{ display: 'flex', alignItems: 'center', marginBottom: '15px'}}>
                            <img src="/src/assets/images/660026.png" alt=""
                                 style={{width: '30px', marginRight: '10px'}}/>
                            <Link to={'/MeausrePro'} style={{textDecoration: 'none',
                                color: location.pathname === '/' ? 'blue' : 'black'}}>메인</Link>
                        </li>
                        <li className={"sidebarListItem mt-2"}
                            style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                            <img src="/src/assets/images/pngtree-printer-icon-png-image_1817556.jpg" alt=""
                                 style={{width: '35px', marginRight: '10px'}}/>
                            <Link to={'/report'} style={{textDecoration: 'none',
                                color: location.pathname === '/report' ? 'blue' : 'black'}}>리포트</Link>
                        </li>
                        <li className={"sidebarListItem mt-2"}
                            style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                            <img src="/src/assets/images/sm_5afc48f016664.jpg" alt=""
                                 style={{width: '35px', marginRight: '10px'}}/>
                            <Link to={'/user'} style={{textDecoration: 'none',
                                color: location.pathname === '/user' ? 'blue' : 'black'}}>회원 관리</Link>
                        </li>
                        <li className={"sidebarListItem mt-2"}
                            style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                            <img src="/src/assets/images/1827737.png" alt=""
                                 style={{width: '30px', marginRight: '10px'}}/>
                            <Link to={'/system'} style={{textDecoration: 'none',
                                color: location.pathname === '/system' ? 'blue' : 'black'}}>시스템 관리</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NavBar;