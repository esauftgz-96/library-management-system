import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthHandler";
import axios from 'axios';
import { Navbar } from "../components/Navbar";
import { checkMembership } from "../components/MathComponents";
import '../css/PagesWithTables.css';

export const UserProfile = () => {
    const {login,user,baseUrl,membershipLength} = useAuth();
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
            const userPWChange = {
                ...user,
                passwordHashed: newPassword,
            }
            const res = await axios.put(baseUrl+`/api/user/update`,userPWChange);
            if (res.status === 200) {
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

    return (<>
        <Navbar/>
        <div className="container">
            <h1 className="windowheader">Profile Details</h1>
            <div className="windowcontent">
                <button onClick={handleRefresh} className="submitbutton">Refresh</button>
                <br />
                <form onSubmit={handleSubmit}  className="inputbox">
                    <label htmlFor="name">Name</label><input id="name" type="text" value={userDetails.name} onChange={handleForm}/>
                    <label htmlFor="birthday">Date of Birth</label><input id="birthday" type="date" value={userDetails.birthday} onChange={handleForm}/>
                    <label htmlFor="address">Address</label><input id="address" type="text" value={userDetails.address} onChange={handleForm}/>
                    <label htmlFor="contactNumber">Contact</label><input id="contactNumber" type="text" value={userDetails.contactNumber} onChange={handleForm}/>
                    <button className="submitbutton">Save Changes</button>
                </form> 
            </div>
        </div>

        <div className="tablecontainer">
            <table>
                <tr>
                    <th>Email (Login ID)</th>
                    <td>{userDetails.email}</td>
                </tr>
                <tr>
                    <th>Membership Status</th>
                    <td>{checkMembership(userDetails.lastRegistered,membershipLength)}</td>
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

        <div className="container">
            <h1 className="windowheader">Password Management</h1>
            <div className="windowcontent">
                <form onSubmit={handlePasswordChange} className="inputbox">
                    <label htmlFor="password">New Password:</label><input id="password" type="text" value={newPassword} onChange={handlePassword}/>
                    <button className="submitbutton">Change Password (Warning: Irreversible)</button>
                </form>
            </div>
        </div>
    </>)
}