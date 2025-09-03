import { createContext, useContext, useState, useEffect } from "react";
import { useIdleTimer } from "react-idle-timer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const[user,setUser]=useState(null);
    const navigate = useNavigate();
    const baseUrl = "http://localhost:8080";

    // Business rules
    const maxLoanPeriod = 14;
    const maxRenewalsPerBook = 2;
    const maxFinePenalty = 20;
    const membershipLength = 365;
    const penaltyPerDay = 0.5;
    const maxBooksLent = 3;
    const overdueLimitForLending = 10;
    // End of business rules

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

    //login, then with stored token (see Login.jsx), set axios header
    const login = (userData) => {
    const token = localStorage.getItem("token");
        if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log(`Token ${token} added to storage.`)
        }
        setUser(userData);
    };

    //logout, removes the token
    const logout = () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        navigate("/");
    };

    // axios interceptor to check if the token is expired
    useEffect(() => {
        //intercept before trycatch
        //on mount, setup this global axios setting
        const interceptor = axios.interceptors.response.use(
            //if no issue, use response as response
            response => response,
            //if error met like with 401
            error => {
                //backend setup so 401 for every request without authorization validation
                if (error.response && error.response.status === 401) {
                alert("Session expired. Please log in again.");
                logout();
                }
                //then pass on so the trycatch can catch
                return Promise.reject(error);
            }
        );

        //cleanup
        return () => axios.interceptors.response.eject(interceptor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    //use below only if persistent login between sessions is needed
    // useEffect(() => {
    // const token = localStorage.getItem("token");
    // if (token) {
    //     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // }
    // }, []);

    return (
        <AuthContext.Provider value = {{user,login,logout,baseUrl,maxLoanPeriod,maxRenewalsPerBook,maxFinePenalty,membershipLength,penaltyPerDay,maxBooksLent,overdueLimitForLending}}>
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

