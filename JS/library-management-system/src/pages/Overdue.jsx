import { useState } from "react";
import { useAuth } from "../components/AuthHandler";
import axios from 'axios';
import { Navbar } from "../components/Navbar";
import { overdueCalc, findDueDate } from "../components/MathComponents";
import '../css/PagesWithTables.css';

export const Overdue = () => {
    const {user,baseUrl,maxLoanPeriod,penaltyPerDay} = useAuth();
    const [lends,setLends] = useState([]);
    const [filter,setFilter] = useState({
        titleContaining: "",
        since: "",
        userEmail: "",
    })

    const handleFilter = (e) => {
        const {id,value} = e.target;
        setFilter(prev=>({
            ...prev,
            [id]:value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(baseUrl+`/api/lending/all`);
            if (res.status === 200) {
                let lendList = res.data;
                lendList = lendList.filter(lend=>(overdueCalc(lend.borrowDate,maxLoanPeriod,penaltyPerDay)>0));
                if (filter.titleContaining) {
                    const substring = filter.titleContaining.toLowerCase().trim();
                    lendList = lendList.filter(lend=>(lend.book.title.toLowerCase().includes(substring)));
                }
                if (filter.since) {
                    lendList = lendList.filter(lend=>(lend.borrowDate>=filter.since));
                }
                if (filter.userEmail) {
                    lendList = lendList.filter(lend=>(lend.user.email.toLowerCase()===filter.userEmail.trim().toLowerCase()));
                }
                setLends(lendList);
            } else {
                alert('Something went wrong, try again.');
            }
        } catch {
            alert('Server/axios error occured, please try again.');
        }
    }

    if (user.isAdmin) {
        return (<>
            <Navbar/>
            <div className="container">
                <h1 className="windowheader">Overdues</h1>
                <div className="windowcontent">
                    <form onSubmit={handleSubmit} className="inputbox">
                        <label htmlFor="titleContaining">Title Containing:</label><input type="text" id="titleContaining" value={filter.titleContaining} onChange={handleFilter}/>
                        <label htmlFor="since">Since:</label><input type="date" id="since" value={filter.since} onChange={handleFilter}/>
                        <label htmlFor="userEmail">User Email (exact):</label><input type="text" id="userEmail" value={filter.userEmail} onChange={handleFilter}/>
                        <button className="submitbutton">Submit/Refresh</button>
                    </form>
                </div>
            </div>

            <div className="tablecontainer">
                <table>
                    <thead>
                        <tr>
                            <th>Book Title</th>
                            <th>Date Borrowed</th>
                            <th>Due Date</th>
                            <th>Accumulated Fines</th>
                            <th>User Name</th>
                            <th>User Email</th>
                            <th>User Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            lends.map(lend=>(
                                <tr key={lend.uid}>
                                    <td>{lend.book.title}</td>
                                    <td>{lend.borrowDate}</td>
                                    <td>{findDueDate(lend.borrowDate)}</td>
                                    <td>{`$${overdueCalc(lend.borrowDate,maxLoanPeriod,penaltyPerDay).toFixed(2)}`}</td>
                                    <td>{lend.user.name}</td>
                                    <td>{lend.user.email}</td>
                                    <td>{lend.user.contactNumber}</td>
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
            <div>
                Unauthorized user. Please login to an Admin account to access this page.
            </div>
        </>)
    }
}