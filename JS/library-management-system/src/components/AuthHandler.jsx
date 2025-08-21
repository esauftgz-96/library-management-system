import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const[user,setUser]=useState(null);
    const login = (userData) => { setUser(userData); };
    const logout = () => setUser(null);
    const baseUrl = "http://localhost:8080";

    return (
        <AuthContext.Provider value = {{user,login,logout,baseUrl}}>
            {children}
        </AuthContext.Provider>
    )
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);