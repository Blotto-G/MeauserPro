import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./page/Main.jsx";
import Login from "./page/Login.jsx";
import {UserProvder} from "./context/UserContext.jsx";;
import UserManagement from "./page/UserManagement.jsx";
import GroupManagement from "./page/GroupManagement.jsx";
import ChartTest from "./page/ChartTest.jsx";

function App() {
    return (
        <UserProvder>
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<Login />} />
                    <Route path={'/MeausrePro'} element={<Main />} />
                    <Route path={'/UserManagement'} element={<UserManagement />} />
                    <Route path={'/GroupManagement'} element={<GroupManagement />}/>

                    {/* 테스트, 추후 삭제 예정 */}
                    <Route path={'/MeausrePro/ChartTest'} element={<ChartTest />} />
                </Routes>
            </BrowserRouter>
        </UserProvder>
    );
}

export default App
