import { createContext, useContext, useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const[user,setUser]=useState(null);
    const login = (userData) => { setUser(userData); };
    const logout = () => setUser(null);
    const navigate = useNavigate();
    const baseUrl = "http://localhost:8080";

    const maxLoanPeriod = 14;
    const maxRenewalsPerBook = 2;
    const maxFinePenalty = 10;
    const membershipLength = 365;
    const penaltyPerDay = 0.5;
    const maxBooksLent = 3;

    useIdleTimer({
        enabled:!!user,
        promptBeforeIdle: 3 * 60 * 1000,
        onPrompt: ()=>{alert(`You are about to be logged out for inactivity.`)},
        timeout: 15 * 60 * 1000,
        onIdle: ()=>{alert('You have been logged out for inactivity');logout();navigate('/');},
        onActive: ()=>{console.log('timer reset')},
        debounce: 500,
        crossTab: false,
    })

    return (
        <AuthContext.Provider value = {{user,login,logout,baseUrl,maxLoanPeriod,maxRenewalsPerBook,maxFinePenalty,membershipLength,penaltyPerDay,maxBooksLent}}>
            {children}
        </AuthContext.Provider>
    )
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

// use this to authenticate admin 
// if (user.isAdmin) {
//     return (<>
//         <Navbar/>
//         <h1></h1>
//     </>)
// } else {
//     return (<>
//         <Navbar/>
//         <div>
//             Unauthorized user. Please login to an Admin account to access this page.
//         </div>
//     </>)
// }

