import { useState } from "react";
import { useAuth } from "../components/AuthHandler";
import axios from 'axios';
import { Navbar } from "../components/Navbar";
import { hashPassword } from "../components/PasswordHandler";

export const AdminProfile = () => {
    const {user,baseUrl} = useAuth();
    const [userDetails,setUserDetails] = useState({});
    const [userEmail, setUserEmail] = useState("");

    const handleUserEmail = (e) => {setUserEmail(e.target.value)};

    const searchByEmail = async() => {
        try {
            const res = await axios.get(baseUrl+`/api/user/email/${userEmail}`);
            if (res.data) {
                setUserDetails(res.data);
            } else {
                alert('User not found, please try again.');
                setUserEmail("");
            }
        } catch {
            alert('Server/axios error occured, please try again.');
        }
    }

    const handleUserDetails = (e) => {
        //type and checkbox for isAdmin
        const {id,value,type,checked} = e.target;
        setUserDetails(prev=>({
            ...prev,
            [id]: (type === "checkbox" ? checked : value),
        }));
    }

    const editUser = async() => {
        if (userDetails.uid) {
            try {
                const res = await axios.put(baseUrl+`/api/user/update`,userDetails);
                if (res.status === 200 && res.data.name === userDetails.name) {
                        alert('Account Updated');
                        setUserEmail(res.data.email);
                        searchByEmail(res.data.email);
                    } else {
                        alert('Something went wrong, please try again.');
                    }
            } catch {
                alert('Server/axios error occured, please try again.');
            }
        } else {
            alert('Input user email and submit first.')
        } 
    }

    const checkMembership = (lastRegistered) => {
        const lastRegisteredDate = new Date(lastRegistered);
        const today = new Date();
        //clear out timing for absolute days
        lastRegisteredDate.setHours(0,0,0,0);
        today.setHours(0,0,0,0);
        const diffTime = today-lastRegisteredDate;
        const diffInDays = Math.floor(diffTime/(1000*60*60*24));
        if (diffInDays <= 365) {
            return "Active"
        } else {
            return "Inactive"
        }
    }

    const renewMembership = async() => {
        if (userDetails.uid) {
            const today = new Date().toISOString().slice(0,10);
            const updatedUser = {
                ...userDetails,
                lastRegistered: today,
            };
            try {
                const res = await axios.put(baseUrl+`/api/user/update`,updatedUser);
                if (res.status === 200 && res.data.lastRegistered === today) {
                    alert('Membership renewed!');
                    setUserEmail(res.data.email);
                    searchByEmail(res.data.email);
                } else {
                    alert('Something went wrong, try again.');
                }
            } catch {
                alert('Server/axios error occured, please try again.');
            }
        } else {
            alert('Input user email and submit first.')
        }
    }

    const resetPassword = async() => {
        if (userDetails.uid) {
            const blankPassword = hashPassword("");
            const updatedUser = {
                ...userDetails,
                password: blankPassword,
            };
            try {
                const res = await axios.put(baseUrl+`/api/user/update`,updatedUser);
                if (res.status === 200 && res.data.passwordHashed === blankPassword) {
                    alert('Password reset to blank. Please inform user to create new password.');
                    setUserEmail(res.data.email);
                    searchByEmail(res.data.email);
                } else {
                    alert('Something went wrong, try again.');
                }
            } catch {
                alert('Server/axios error occured, please try again.');
            }
        } else {
            alert('Input user email and submit first.')
        }
    }

    if (user.isAdmin) {
        return (<>
            <Navbar/>
            <h1>Edit User</h1>
            <label htmlFor="userEmail">Input User Email (exact match):</label><input type="text" value={userEmail} onChange={handleUserEmail}/><button onClick={searchByEmail}>Submit</button>
            <div>
                <table>
                    <tr><th>Field</th><td>Edit</td></tr>
                    <tr><th>User ID (fixed)</th><td>{userDetails.name}</td></tr>
                    <tr><th>Email (fixed)</th><td>{userDetails.email}</td></tr>

                    <tr><th><label htmlFor="name">Name</label></th><td><input id="name" type="text" value={userDetails.name} onChange={handleUserDetails}/></td></tr>
                    <tr><th><label htmlFor="birthday">Date of Birth</label></th><td><input id="birthday" type="date" value={userDetails.birthday} onChange={handleUserDetails}/></td></tr>
                    <tr><th><label htmlFor="address">Address</label></th><td><input id="address" type="text" value={userDetails.address} onChange={handleUserDetails}/></td></tr>
                    <tr><th><label htmlFor="contactNumber">Contact Number</label></th><td><input id="contactNumber" type="text" value={userDetails.contactNumber} onChange={handleUserDetails}/></td></tr>

                    <tr><th>Membership Status</th><td>{userDetails.lastRegistered ? checkMembership(userDetails.lastRegistered) : ""}</td></tr>
                    <tr><th>Membership Last Renewed</th><td>{userDetails.lastRegistered}</td></tr>
                    <tr><th><label htmlFor="isAdmin">Admin?</label></th><td><input id="isAdmin" type="checkbox" checked={userDetails.isAdmin} onChange={handleUserDetails}/><label htmlFor="isAdmin">{userDetails.isAdmin ? "Admin" : "User" }</label></td></tr>
                    <tr><th>Books on Loan (cannot change, please handle in Returns)</th><td>{userDetails.booksLent}</td></tr>
                </table>
                <button onClick={editUser}>Edit User</button>

                <div>
                    Other Functions:
                    <button onClick={renewMembership}>Renew Membership + Edit User</button>
                    <button onClick={resetPassword}>Reset Password + Edit User</button>
                </div>
                

            </div>
        </>)
    } else {
        return (<>
            <Navbar/>
            <div>
                Unauthorized user. Please login to an Admin account to access this page.
            </div>
        </>)
    }
}