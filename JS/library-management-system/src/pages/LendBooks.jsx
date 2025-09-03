import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthHandler";
import axios from 'axios';
import { Navbar } from "../components/Navbar";
import { checkMembership,overdueCalc } from "../components/MathComponents";
import '../css/PagesWithTables.css';

export const LendBooks = () => {
    const {baseUrl,user,maxLoanPeriod,membershipLength,penaltyPerDay,maxBooksLent,overdueLimitForLending,maxFinePenalty} = useAuth();
    const [first,setFirst] = useState(true);
    const [selectedBook, setSelectedBook] = useState({});
    const [selectedUser, setSelectedUser] = useState({});
    const [refresh, setRefresh] = useState(0);
    const [filter, setFilter] = useState({
        title:"",
        author:"",
        category:"",
    });
    const [userEmail, setUserEmail] = useState("");
    const [books,setBooks] = useState([]);

    useEffect(
            ()=>{
                const getBooks = async(title,author,category) => {
                    //this will configure the search into /search?title=...&author=...&category=...
                    const params = new URLSearchParams();
                    if (title) {params.append('title',title);};
                    if (author) {params.append('author',author);};
                    if (category) {params.append('category',category);};
    
                    try {
                        const res = await axios.get(baseUrl+`/api/book/filter?${params.toString()}`);
                        if (res.status === 200) {
                            setBooks(res.data);
                        } else {
                            alert('Something went wrong, try again.');
                        }
                    } catch {
                        alert('Server/axios error occured, please try again.');
                    }
                };
                
                if (!first) {
                    getBooks(filter.title,filter.author,filter.category); 
                } else {
                    setFirst(false);
                    return;
                }
            // eslint-disable-next-line react-hooks/exhaustive-deps
            },[refresh]
        );

    const handleFilter = (e) => {
        const {id, value} = e.target;
        setFilter(prev=>({
            ...prev,
            [id]:value,
        }));
    };

    const handleRefreshFilter = () => {setRefresh(prev=>prev+1);};

    const handleEmail = (e) => {setUserEmail(e.target.value);};

    const selectBook = (book) => {setSelectedBook(book);};

    const searchUser = async() => {
        try {
            const res = await axios.get(baseUrl+`/api/user/email/${userEmail}`);
            if (res.data.uid) {
                const user = res.data;
                setSelectedUser(user);
            } else {
                alert(`No user with matching email exists, please try again.`);
            }
        } catch {
            alert('Server/axios error occured, please try again.');
        }
    }

    const submitLoan = async() => {
        if (!selectedBook.uid || !selectedUser.uid) {
            alert("Both book and user must be selected");
            return;
        }
        try {
            const currentLends = await axios.get(baseUrl+`/api/lending/userid/${selectedUser.uid}`);
            let lendings = [];
            if (currentLends.status===200) {
                lendings = currentLends.data;
            } else {
                alert('Something went wrong, try again.');
                return;
            }
            if (lendings.some(lending=>(lending.returnDate==null&&((new Date() - new Date(lending.borrowDate)) / (1000 * 60 * 60 * 24)) > maxLoanPeriod))) {
                alert(`No loans can be made while there are overdues.`)
                return;
            }
            if (lendings.some(lending=>(lending.returnDate==null&&overdueCalc(lending.borrowDate,maxLoanPeriod,penaltyPerDay,maxFinePenalty)>overdueLimitForLending))) {
                alert(`No loans can be made when the pending overdue fines is above $${overdueLimitForLending}.`);
                return;
            }
            if (selectedUser.booksLent>=maxBooksLent) {
                alert(`Maximum amount of books on loan at once of ${maxBooksLent} has been reached.`);
                return;
            }
            if (checkMembership(selectedUser.lastRegistered,membershipLength)==="Inactive") {
                alert(`Membership status is inactive.`);
                return;
            }
            if (selectedBook.copiesAvailable<1) {
                alert('Not enough available copies for book selected.');
                return;
            }
            const today = new Date();
            const updatedUser = {
                ...selectedUser,
                booksLent: (selectedUser.booksLent+1),
            }
            const updatedBook = {
                ...selectedBook,
                copiesAvailable: (selectedBook.copiesAvailable-1),
                copiesLent: (selectedBook.copiesLent+1),
            }
            const newLoan = {
                book: updatedBook,
                user: updatedUser,
                borrowDate: today.toISOString().split('T')[0],
                renewalCount: 0,
            }
            const userRes = await axios.put(baseUrl+`/api/user/update`,updatedUser);
            const bookRes = await axios.put(baseUrl+`/api/book/update`,updatedBook);
            const lendRes = await axios.post(baseUrl+`/api/lending/new`,newLoan);
            if (userRes.status === 200 && userRes.data.uid === updatedUser.uid && bookRes.status === 200 && bookRes.data.uid === updatedBook.uid && lendRes.status === 200 && lendRes.data.borrowDate) {
                alert(`Loan with uid ${lendRes.data.uid} created: ${userRes.data.name} - ${bookRes.data.name}`);
                setSelectedBook({});
                setSelectedUser({});
                handleRefreshFilter();
            }
        } catch {
            alert('Server/axios error occured, please try again.');
        }
    }

    if (user.isAdmin) {
        return (<>
            <Navbar/>
            <div className="container"><h1 className="windowheader">Loan Books</h1></div>
            <div className="container">
                <h1 className="windowheader">Step 1: Select Book</h1>
                <div className="windowcontent">
                    <div  className="inputbox">
                        <label htmlFor="title">Title:</label><input id="title" type="text" value={filter.title} onChange={handleFilter}/>
                        <label htmlFor="author">Author:</label><input id="author" type="text" value={filter.author} onChange={handleFilter}/>
                        <label htmlFor="category">Category:</label><input id="category" type="text" value={filter.category} onChange={handleFilter}/>            
                        <button onClick={handleRefreshFilter} className="submitbutton">Show by Filter</button>
                    </div>
                </div>
            </div>
            <div className="tablecontainer">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>ISBN</th>
                            <th>Year Published</th>
                            <th>Author</th>
                            <th>Categories</th>
                            <th>Location</th>
                            <th>Available</th>
                            <th>Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            books.map(book=>(
                                <tr key={book.uid}>
                                    <td>{book.title}</td>
                                    <td>{book.isbn}</td>
                                    <td>{book.publicationYear}</td>
                                    <td>{book.author}</td>
                                    <td>{book.category}</td>
                                    <td>{book.physicalSection}</td>
                                    <td>{book.copiesAvailable}</td>
                                    <td><button onClick={()=>selectBook(book)}>SELECT</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                    
                </table>
            </div>
            <div className="container">
                <h1 className="windowheader">Step 2: Select User by Email</h1>
                <div className="windowcontent">
                    <div className="inputbox">
                        <label htmlFor="email">Input email (exact):</label><input type="text" id="email" value={userEmail} onChange={handleEmail}/>
                        <button onClick={searchUser} className="submitbutton">Search & Select</button>
                    </div>
                    <div className="report">{!selectedUser.uid?"":<>User Found: {selectedUser.name}</>}</div>
                </div>
            </div>
            
            <div className="container">
                <h1 className="windowheader">Step 3: Finalize</h1>
                <div className="windowcontent">
                    <div className="inputbox">
                        <div>Selected Book: {!selectedBook.uid?"None selected":<>{selectedBook.title}</>}</div>
                        <div>Selected User: {!selectedUser.uid?"None selected":<>{selectedUser.name} ({selectedUser.email})</>}</div>
                        <button onClick={submitLoan} className="submitbutton">Submit</button>
                    </div>
                </div>
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