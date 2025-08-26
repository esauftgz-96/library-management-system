import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const[user,setUser]=useState(null);
    const login = (userData) => { setUser(userData); };
    const logout = () => setUser(null);
    const baseUrl = "http://localhost:8080";

    const maxLoanPeriod = 14;
    const maxRenewalsPerBook = 2;
    const maxFinePenalty = 10;
    const membershipLength = 365;
    const penaltyPerDay = 0.5;
    const maxBooksLent = 3;

    return (
        <AuthContext.Provider value = {{user,login,logout,baseUrl,maxLoanPeriod,maxRenewalsPerBook,maxFinePenalty,membershipLength,penaltyPerDay,maxBooksLent}}>
            {children}
        </AuthContext.Provider>
    )
};

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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);