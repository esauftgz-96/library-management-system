import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthHandler";
import axios from 'axios';
import { Navbar } from "../components/Navbar";
import '../css/PagesWithTables.css';

export const EditBooks = () => {
    const {baseUrl,user} = useAuth();
    const [first,setFirst] = useState(true);
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState({
        uid:0,
        isbn:"",
        title:"",
        publicationYear:0,
        author:"",
        category:"",
        physicalSection:"",
        copiesAvailable:0,
        copiesReserved:0,
        copiesLent:0,
    });
    const [refresh, setRefresh] = useState(0);
    const [filter, setFilter] = useState({
        title:"",
        author:"",
        category:"",
    });

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
                        setBooks(res.data);
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
    }

    const handleRefreshFilter = () => {
        setRefresh(prev=>prev+1);
    };

    const selectBook = (book) => {
        setSelectedBook(book);
    }

    const handleBookChange = (e) => {
        const {id,type,value} = e.target;
        setSelectedBook(prev=>({
            ...prev,
            [id]:type==="number"?(value === "" ? 0 : parseInt(value)):value,
        }))
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (selectedBook.uid!==0) {
            try {
                const res = await axios.put(baseUrl+`/api/book/update`,selectedBook);
                if (res.status===200 && res.data.uid===selectedBook.uid) {
                    alert('Book successfully edited');
                    setSelectedBook({
                        uid:0,
                        isbn:"",
                        title:"",
                        publicationYear:0,
                        author:"",
                        category:"",
                        physicalSection:"",
                        copiesAvailable:0,
                        copiesReserved:0,
                        copiesLent:0,
                    });
                } else {
                    alert('Something went wrong, try again.');
                }
            } catch {
                alert('Server/axios error occured, please try again.');
            }
        } else {
            alert('Please select a book first.')
        }
    }

    if (user.isAdmin) {
        return (<>
            <Navbar/>
            <div className="container"><h1 className="windowheader">Edit Books</h1></div>
            <div className="container">
                <h1 className="windowheader">Filter Books (Click Select to Further Edit)</h1>
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
                <h1 className="windowheader">Edit Selected Book</h1>
                <div className="windowcontent">
                    <form onSubmit={handleSubmit}   className="inputbox">
                    <label htmlFor="uid">UID (Fixed):</label><div>{selectedBook.uid===0?"":selectedBook.uid}</div>
                    <label htmlFor="isbn">ISBN:</label><input type="text" id="isbn" value={selectedBook.isbn} onChange={handleBookChange}/>
                    <label htmlFor="title">Title:</label><input type="text" id="title" value={selectedBook.title} onChange={handleBookChange}/>
                    <label htmlFor="publicationYear">Year of Publication:</label><input type="number" id="publicationYear" value={selectedBook.uid===0?"":selectedBook.publicationYear} onChange={handleBookChange}/>
                    <label htmlFor="author">Author:</label><input type="text" id="author" value={selectedBook.author} onChange={handleBookChange}/>
                    <label htmlFor="category">Category:</label><input type="text" id="category" value={selectedBook.category} onChange={handleBookChange}/>
                    <label htmlFor="physicalSection">Physical Location:</label><input type="text" id="physicalSection" value={selectedBook.physicalSection} onChange={handleBookChange}/>
                    <label htmlFor="copiesAvailable">Copies Available:</label><input type="number" id="copiesAvailable" value={selectedBook.uid===0?"":selectedBook.copiesAvailable} onChange={handleBookChange}/>
                    <label htmlFor="copiesReserved">Copies Reserved:</label><input type="number" id="copiesReserved" value={selectedBook.uid===0?"":selectedBook.copiesReserved} onChange={handleBookChange}/>
                    <label htmlFor="copiesLent">Copies on Loan (Change in Return Books):</label><div>{selectedBook.uid===0?"":selectedBook.copiesLent}</div>
                    <button className="submitbutton">Submit Changes</button>
            </form>
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