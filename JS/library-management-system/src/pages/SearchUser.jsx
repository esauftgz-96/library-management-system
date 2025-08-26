import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthHandler";
import axios from 'axios';
import { Navbar } from "../components/Navbar";
import { checkMembership,overdueCalc } from "../components/MathComponents";
import '../css/PagesWithTables.css';

export const SearchUser = () => {
    const {user,baseUrl,maxLoanPeriod,membershipLength,penaltyPerDay} = useAuth();
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [first,setFirst] = useState(true);
    const [submit, setSubmit] = useState(0);
    const [filter,setFilter] = useState({
        uid:-1,
        name:"",
        email:"",
        checkOverdue:false,
        overdueCount:0,
    });

    useEffect(
        ()=> {
            const getUsers = async(uid,name,email,checkOverdue,overdueCount,maxLoanPeriod) => {
                if (!first) {
                    const params = new URLSearchParams();
                    if (uid>=0) {params.append('uid',uid)};
                    if (name) {params.append('name',name)};
                    if (email) {params.append('email',email)};
                    if (checkOverdue) {
                        params.append('overdueCount',overdueCount);
                        params.append('maxLoanPeriod',maxLoanPeriod);
                    } else {
                        params.append('overdueCount',-1);
                        params.append('maxLoanPeriod',-1);
                    }

                    try {
                        const res = await axios.get(baseUrl+`/api/user/filter?${params.toString()}`);
                        setFilteredUsers(res.data);

                    } catch {
                        alert('Server/axios error occured, please try again.');
                    }
                } else {
                    setFirst(false);
                    return;
                }
            }
            getUsers(filter.uid,filter.name,filter.email,filter.checkOverdue,filter.overdueCount,maxLoanPeriod);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [submit]
    )

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmit(prev=>(prev+1));
    }

    const handleFilter = (e) => {
        const {id, value, type, checked} = e.target;
        const numericalFields = ["uid","overdueCount"];
        setFilter(prev=>({
            ...prev,
            [id]: (type==="checkbox"?checked
                :(!numericalFields.includes(id))? value
                :id==="overdueCount"? parseInt(value)
                :value===""?-1
                :parseInt(value)
            )
        }));
    }

    if (user.isAdmin) {
        return (<>
            <Navbar/>
            <div className="container">
                <h1 className="windowheader">Search for User/Overdue</h1>
                <div className="windowcontent">
                    <form onSubmit={handleSubmit} className="inputbox">
                        <label htmlFor="uid">User ID (exact)</label><input type="number" id="uid" value={filter.uid===-1?"":filter.uid} onChange={handleFilter}/>
                        <label htmlFor="name">Name</label><input type="text" id="name" value={filter.name} onChange={handleFilter}/>
                        <label htmlFor="email">Email</label><input type="text" id="email" value={filter.email} onChange={handleFilter}/>
                        <label htmlFor="checkOverdue">Filter Overdue(Total, exact)?</label><div><input type="checkbox" id="checkOverdue" checked={filter.checkOverdue} onChange={handleFilter}/><input type="number" id="overdueCount" value={filter.overdueCount} onChange={handleFilter}/></div>
                        <button className="submitbutton">Submit</button>
                    </form>
                </div>     
            </div>
            
            <div className="tablecontainer">
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Date of Birth</th>
                            <th>Address</th>
                            <th>Email</th>
                            <th>Contact Number</th>
                            <th>Books on Loan</th>
                            <th>Active Member?</th>
                            <th>Admin?</th>
                            <th>Total Overdue Books</th>
                            <th>Total Accumulated Fines</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredUsers.map(filteredUser=>(
                                <tr key={filteredUser.uid}>
                                    <td>{filteredUser.uid}</td>
                                    <td>{filteredUser.name}</td>
                                    <td>{filteredUser.birthday}</td>
                                    <td>{filteredUser.address}</td>
                                    <td>{filteredUser.email}</td>
                                    <td>{filteredUser.contactNumber}</td>
                                    <td>{filteredUser.booksLent}</td>
                                    <td>{checkMembership(filteredUser.lastRegistered,membershipLength)}</td>
                                    <td>{filteredUser.isAdmin?"Admin":"User"}</td>
                                    <td>{filteredUser.lends.filter(lend=>lend.returnDate===null).length}</td>
                                    <td>${filteredUser.lends.filter(lend=>lend.returnDate===null).reduce((acc,val)=>acc+overdueCalc(val.borrowDate,maxLoanPeriod,penaltyPerDay),0).toFixed(2)}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
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