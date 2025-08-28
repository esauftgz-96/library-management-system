import { useState } from "react";
import { useAuth } from "../components/AuthHandler";
import axios from 'axios';
import { Navbar } from "../components/Navbar";
import { hashPassword } from "../components/PasswordHandler";
import { checkMembership } from "../components/MathComponents";
import '../css/PagesWithTables.css';

export const AdminProfile = () => {
    const {user,baseUrl,membershipLength} = useAuth();
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
            const blankPassword = await hashPassword("");
            const updatedUser = {
                ...userDetails,
                passwordHashed: blankPassword,
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

    const deleteUser = async() => {
        if (userDetails.uid) {
            try {
                const res = await axios.delete(baseUrl+`/api/user/delete/${userDetails.uid}`);
                if (res.status === 200) {
                    alert(`User deleted, please refresh with the above Submit/Refresh button.`);
                } else {
                    alert('Server/axios error occured, please try again.');
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
            <div className="container">
                <h1 className="windowheader">Edit User</h1>
                <div className="windowcontent">
                    <div className="inputbox">
                        <label htmlFor="userEmail">Input User Email (exact match):</label><input type="text" value={userEmail} onChange={handleUserEmail}/>
                    </div>
                    <button onClick={searchByEmail} className="submitbutton">Submit/Refresh</button>
                </div>
            </div>

            <div className="tablecontainer">
                <table>
                    <tr><th>Field</th><th>Edit</th></tr>
                    <tr><th>User ID (fixed)</th><td>{userDetails.name}</td></tr>
                    <tr><th>Email (fixed)</th><td>{userDetails.email}</td></tr>

                    <tr><th><label htmlFor="name">Name</label></th><td><input id="name" type="text" value={userDetails.name} onChange={handleUserDetails}/></td></tr>
                    <tr><th><label htmlFor="birthday">Date of Birth</label></th><td><input id="birthday" type="date" value={userDetails.birthday} onChange={handleUserDetails}/></td></tr>
                    <tr><th><label htmlFor="address">Address</label></th><td><input id="address" type="text" value={userDetails.address} onChange={handleUserDetails}/></td></tr>
                    <tr><th><label htmlFor="contactNumber">Contact Number</label></th><td><input id="contactNumber" type="text" value={userDetails.contactNumber} onChange={handleUserDetails}/></td></tr>

                    <tr><th>Membership Status</th><td>{userDetails.lastRegistered ? checkMembership(userDetails.lastRegistered,membershipLength) : "Inactive"}</td></tr>
                    <tr><th>Membership Last Renewed</th><td>{userDetails.lastRegistered}</td></tr>
                    <tr><th><label htmlFor="isAdmin">Admin?</label></th><td><input id="isAdmin" type="checkbox" checked={userDetails.isAdmin} onChange={handleUserDetails}/><label htmlFor="isAdmin">{userDetails.isAdmin ? "Admin" : "User" }</label></td></tr>
                    <tr><th>Books on Loan (cannot change, please handle in Returns)</th><td>{userDetails.booksLent}</td></tr>
                </table>
                
            </div>

            <div className="buttoncontainer">
                <button onClick={editUser} className="specialbutton">Edit User</button>
                <button onClick={renewMembership} className="specialbutton">Renew Membership + Edit User</button>
                <button onClick={resetPassword} className="specialbutton">Reset Password + Edit User</button>
                <button onClick={deleteUser} className="specialbutton">Delete User</button>
            </div>
        </>)
    } else {
        return (<>
            <Navbar/>
            <div className="unauthorizeduser">
                Unauthorized user. Please login to an Admin account to access this page.
            </div>
        </>)
    }
}