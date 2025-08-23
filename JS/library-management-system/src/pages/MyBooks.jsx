import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthHandler";
import axios from 'axios';
import { Navbar } from "../components/Navbar";

export const MyBooks = () => {
    const {user, baseUrl} = useAuth();
    const [lendings, setLendings] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [pendingToggle, setPendingToggle] = useState(false);

    useEffect(
        ()=>{
            const getLendings = async() => {
                try {
                    const res = await axios.get(baseUrl+`/api/lending/userid/${user.uid}`);
                    setLendings(res.data);
                } catch {
                    alert('Server/axios error occured, please try again.');
                }
                
            }
            getLendings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        },[refresh]
    );

    const handleToggleAll = () => {
        setPendingToggle(false);
        setRefresh(prev=>prev+1);
    };

    const handleTogglePending = () => {
        setPendingToggle(true);
        setRefresh(prev=>prev+1);
    }

    const overdueCalc = (borrowDate) => {
        const borrowedOn = new Date(borrowDate);
        const today = new Date();
        //clear out timing for absolute days
        borrowedOn.setHours(0,0,0,0);
        today.setHours(0,0,0,0);
        const diffTime = today-borrowedOn;
        const diffInDays = Math.floor(diffTime/(1000*60*60*24));
        if (diffInDays <= 14) {
            return 0;
        } else {
            return Math.max(20,(diffInDays-14)*0.5);
        }
    }

    return (<>
        <Navbar/>
        <h1>My Books on Loan</h1>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Book Title</th>
                        <th>Date Borrowed</th>
                        <th>Date Returned</th>
                        <th>Renewals Done</th>
                        <th>Pending Overdue</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        pendingToggle? (
                            lendings.filter(lending=>lending.returnDate===null).map(lending=>(
                                <tr key={lending.uid}>
                                    <td>{lending.book.title}</td>
                                    <td>{lending.borrowDate}</td>
                                    <td>{lending.returnDate ?? "Not returned"}</td>
                                    <td>{lending.renewalCount}</td>
                                    <td>{"$"+overdueCalc(lending.borrowDate).toFixed(2)}</td>
                                </tr>
                            ))
                        ) 
                        : 
                        (
                            lendings.map(lending=>(
                                <tr key={lending.uid}>
                                    <td>{lending.book.title}</td>
                                    <td>{lending.borrowDate}</td>
                                    <td>{lending.returnDate ?? "Not returned"}</td>
                                    <td>{lending.renewalCount}</td>
                                    <td>{lending.returnDate?"Returned":"$"+overdueCalc(lending.borrowDate).toFixed(2)}</td>
                                </tr>
                            ))
                        )
                    }
                </tbody>   
            </table>
        </div>
        <div>Pending Total Overdue = ${
            lendings.filter(lending=>lending.returnDate===null).reduce((acc,val)=>acc+overdueCalc(val.borrowDate),0).toFixed(2)
            }
        </div>
        <button onClick={handleToggleAll}>Show all loan history</button>
        <button onClick={handleTogglePending}>Show pending loans</button>
    </>)
}