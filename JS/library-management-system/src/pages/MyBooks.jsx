import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthHandler";
import axios from 'axios';
import { Navbar } from "../components/Navbar";
import { overdueCalc } from "../components/MathComponents";
import '../css/PagesWithTables.css';

export const MyBooks = () => {
    const {user, baseUrl,maxLoanPeriod,penaltyPerDay} = useAuth();
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

    return (<>
        <Navbar/>
        <div className="container">
            <h1 className="windowheader">My Books</h1>
            <div>Total Accumulated Fines = ${
                lendings.filter(lending=>lending.returnDate==null).reduce((acc,val)=>acc+overdueCalc(val.borrowDate,maxLoanPeriod,penaltyPerDay),0).toFixed(2)
                }
            </div>
            <div  className="inputboxwithspacing">
                <button onClick={handleToggleAll}>Show all loan history</button>
                <button onClick={handleTogglePending}>Show pending loans</button>
            </div>   
        </div>
        <div className="tablecontainer">
            <table>
                <thead>
                    <tr>
                        <th>Book Title</th>
                        <th>Date Borrowed</th>
                        <th>Date Returned</th>
                        <th>Renewals Done</th>
                        <th>Accumulated Fines</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        pendingToggle? (
                            lendings.filter(lending=>lending.returnDate==null).map(lending=>(
                                <tr key={lending.uid}>
                                    <td>{lending.book.title}</td>
                                    <td>{lending.borrowDate}</td>
                                    <td>{lending.returnDate ?? "Not returned"}</td>
                                    <td>{lending.renewalCount}</td>
                                    <td>{"$"+overdueCalc(lending.borrowDate,maxLoanPeriod,penaltyPerDay).toFixed(2)}</td>
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
                                    <td>{lending.returnDate?"Returned":"$"+overdueCalc(lending.borrowDate,maxLoanPeriod,penaltyPerDay).toFixed(2)}</td>
                                </tr>
                            ))
                        )
                    }
                </tbody>   
            </table>
        </div>
    </>)
}