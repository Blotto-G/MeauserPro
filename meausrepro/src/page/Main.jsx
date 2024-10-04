import {useContext} from "react";
import UserContext from "../context/UserContext.jsx";

function Main() {
    const { user } = useContext(UserContext);
   
    return (
        <div className={'container'}>
            {user.id? (
                <div>
                    <p>{user.name}</p>
                </div>
            ) : (
                <p>로그인 필요</p>
            )}
        </div>
    )
}
export default Main;