import React, {useState} from "react";

const UserContext = React.createContext();

export const UserProvder = ({children}) => {
    const[user, setUser] = useState({
        idx: 0,
        id: '',
        pass: '',
        name: '',
        tel: '',
        role: '',
        topManager: ''
    });

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;