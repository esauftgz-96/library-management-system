import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthHandler";
import axios from 'axios';
import { Navbar } from "../components/Navbar";
import { overdueCalc } from "../components/MathComponents";

export const RenewLoan = () => {
    const {baseUrl,user,maxLoanPeriod,penaltyPerDay,maxRenewalsPerBook} = useAuth();
    const [first,setFirst] = useState(true);
    const [userEmail, setUserEmail] = useState("");
    const [selectedUser, setSelectedUser] = useState({});
    const [lendings, setLendings] = useState([]);
    
    useEffect(()=>{
        const getLendings = async(uid) => {
            try {
                const res = await axios.get(baseUrl+`/api/lending/userid/${uid}`);
                if (res.status === 200) {
                    setLendings(res.data);
                } else {
                    alert('Something went wrong, try again.');
                }
            } catch {
                alert('Server/axios error occured, please try again.');
            }
        }
        if (!first) {
            getLendings(selectedUser.uid);
        } else {
            setFirst(false);
            return;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedUser.uid])

    const handleEmail = (e) => {setUserEmail(e.target.value);};

    const searchUser = async() => {
        try {
            const res = await axios.get(baseUrl+`/api/user/email/${userEmail}`);
            if (res.status === 200 && res.data.uid) {
                const user = res.data;
                setSelectedUser(user);
                setLendings([]);
            } else {
                alert(`No user with matching email exists, please try again.`);
            }
        } catch {
            alert('Server/axios error occured, please try again.');
        }
    }

    const renewLending = async(lending) => {
        if (overdueCalc(lending.borrowDate,maxLoanPeriod,penaltyPerDay)>0) {
            alert('Pending overdue fine. Do not renew.');
            return;
        }
        if (lending.renewalCount >= maxRenewalsPerBook) {
            alert('Max renewals reached.');
            return;
        }
        const today = new Date();
        const updatedLending = {
            ...lending,
            borrowDate: today.toISOString().split('T')[0],
            renewalCount: lending.renewalCount+1,
        }
        try {
            const res = await axios.put(baseUrl+`/api/lending/update`,updatedLending);
            if (res.status === 200 && res.data.renewalCount === updatedLending.renewalCount) {
                alert(`Book loan renewed`);
                //triggers the dependency array
                setSelectedUser({...selectedUser});
            } else {
                alert('Something went wrong, try again.');
            }
        } catch {
            alert('Server/axios error occured, please try again.');
        }
    }

    const returnBook = async(lending) => {
        const fine = overdueCalc(lending.borrowDate,maxLoanPeriod,penaltyPerDay);
        if (fine>0) {
            const confirmLoanPaid = window.confirm(`Please confirm whethere the outstanding loan of $${fine.toFixed(2)} has been paid.`)
            if (!confirmLoanPaid) {
                return;
            }
        }
        const today = new Date();
        const updatedLending = {
            ...lending,
            returnDate: today.toISOString().split('T')[0],
        }
        const updatedUser = {
            ...selectedUser,
            booksLent: selectedUser.booksLent-1,
        }
        try {
            const selectBookRes = await axios.get(baseUrl+`/api/book/id/${lending.book.uid}`)
            if (selectBookRes.status === 200 && selectBookRes.data.uid === lending.book.uid) {
                const bookToBeUpdated = selectBookRes.data;
                const updatedBook = {
                    ...bookToBeUpdated,
                    copiesAvailable: bookToBeUpdated.copiesAvailable+1,
                    copiesLent: bookToBeUpdated.copiesLent-1,
                };
                const userRes = await axios.put(baseUrl+`/api/user/update`,updatedUser);
                const bookRes = await axios.put(baseUrl+`/api/book/update`,updatedBook);
                const lendRes = await axios.put(baseUrl+`/api/lending/update`,updatedLending);
                if (userRes.status === 200 && userRes.data.uid === updatedUser.uid && bookRes.status === 200 && bookRes.data.uid === updatedBook.uid && lendRes.status === 200 && lendRes.data.returnDate === today.toISOString().split('T')[0]) {
                    alert(`Book returned.`);
                    setSelectedUser({});
                } else {
                    alert('Something went wrong, try again.');
                }
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
            <h1>Book Returns/Loan Renewal</h1>
            <h1>Select User</h1>
            <div>
                <label htmlFor="email">Input email (exact):</label><input type="text" id="email" value={userEmail} onChange={handleEmail}/>
                <button onClick={searchUser}>Search & Select</button>
                <div>{!selectedUser.uid?"":<>User Found: {selectedUser.name}</>}</div>
            </div>
            <h1>Pending Loans</h1>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Book Title</th>
                            <th>Date Borrowed</th>
                            <th>Date Returned</th>
                            <th>Renewals Done</th>
                            <th>Accumulated Fines</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            lendings.filter(lending=>lending.returnDate===null).map(lending=>(
                                <tr key={lending.uid}>
                                    <td>{lending.book.title}</td>
                                    <td>{lending.borrowDate}</td>
                                    <td>{lending.returnDate ?? "Not returned"}</td>
                                    <td>{lending.renewalCount}</td>
                                    <td>{"$"+overdueCalc(lending.borrowDate,maxLoanPeriod,penaltyPerDay).toFixed(2)}</td>
                                    <td><button onClick={()=>renewLending(lending)}>RENEW</button><button onClick={()=>returnBook(lending)}>RETURN</button></td>
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