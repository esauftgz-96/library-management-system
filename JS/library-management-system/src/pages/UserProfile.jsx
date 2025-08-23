import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthHandler";
import axios from 'axios';
import { Navbar } from "../components/Navbar";
import { hashPassword } from "../components/PasswordHandler";

export const UserProfile = () => {
    const {login,user,baseUrl} = useAuth();
    const [userDetails,setUserDetails] = useState({});
    const [refresh, setRefresh] = useState(0);
    const [newPassword,setNewPassword] = useState("");

    useEffect(
        ()=>{
            setUserDetails(user);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        },[refresh]
    )

    const handleRefresh = () => {setRefresh(prev=>prev+1);};

    const handleForm = (e) => {
        const {id,value} = e.target;
        setUserDetails(prev=>({
            ...prev,
            [id]:value,
        }));
    }

    const handlePassword = (e) => {setNewPassword(e.target.value)};

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const res = await axios.put(baseUrl+`/api/user/update`,userDetails)
            if (res.status === 200 && res.data.name === userDetails.name) {
                    alert('Account Updated');
                    login(userDetails);
                } else {
                    alert('Something went wrong, please try again.');
                }
        } catch {
            alert('Server/axios error occured, please try again.');
        }
        handleRefresh();
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            const newPasswordSubmit = await hashPassword(newPassword);
            const userPWChange = {
                ...user,
                passwordHashed: newPasswordSubmit,
            }
            const res = await axios.put(baseUrl+`/api/user/update`,userPWChange);
            if (res.status === 200 && res.data.passwordHashed === newPasswordSubmit) {
                    alert('Password changed.');
                    login(userDetails);
                } else {
                    alert('Something went wrong, try again.');
                    setNewPassword(""); 
                }
        } catch {
            alert('Server/axios error occured, please try again.');
            setNewPassword(""); 
        }
        handleRefresh();
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

    return (<>
        <Navbar/>
        <h1>Profile Details</h1>
        <button onClick={handleRefresh}>Refresh</button>

        <form onSubmit={handleSubmit}>
            <label htmlFor="name"></label>Name<input id="name" type="text" value={userDetails.name} onChange={handleForm}/>
            <label htmlFor="birthday">Date of Birth</label><input id="birthday" type="date" value={userDetails.birthday} onChange={handleForm}/>
            <label htmlFor="address">Address</label><input id="address" type="text" value={userDetails.address} onChange={handleForm}/>
            <label htmlFor="contactNumber">Contact</label><input id="contactNumber" type="text" value={userDetails.contactNumber} onChange={handleForm}/>
            <button>Save Changes</button>
        </form>

        <form onSubmit={handlePasswordChange}>
            <label htmlFor="password">New Password:</label><input id="password" type="text" value={newPassword} onChange={handlePassword}/>
            <button>Change Password (Warning: Irreversible)</button>
        </form>
        
        <div>
            <table>
                <tr>
                    <th>Email (Login ID)</th>
                    <td>{userDetails.email}</td>
                </tr>
                <tr>
                    <th>Membership Status</th>
                    <td>{checkMembership(userDetails.lastRegistered)}</td>
                </tr>
                <tr>
                    <th>Membership Last Renewed</th>
                    <td>{userDetails.lastRegistered}</td>
                </tr>
                <tr>
                    <th>Total Books on Loan</th>
                    <td>{userDetails.booksLent}</td>
                </tr>
                <tr>
                    <th>Account Authorization</th>
                    <td>{userDetails.isAdmin?"Admin":"User"}</td>
                </tr>
            </table>
        </div>
    </>)
}