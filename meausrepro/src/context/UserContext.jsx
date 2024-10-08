import React, {useState} from "react";

const UserContext = React.createContext();

export const UserProvder = ({children}) => {
    const[user, setUser] = useState({
        id: '',
        pass: '',
        name: '',
        tel: ''
    });

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;