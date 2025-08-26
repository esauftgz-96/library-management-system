import { useState } from "react";
import { useAuth } from "../components/AuthHandler";
import axios from 'axios';
import { Navbar } from "../components/Navbar";
import '../css/AddBooks.css';

export const AddBooks = () => {
    const {user,baseUrl} = useAuth();
    const [responseUid, setResponseUid] = useState(0);
    const [newBook, setNewBook] = useState({
        //uid is auto increment
        isbn: "",
        title: "",
        publicationYear: 0,
        author: "",
        category: "",
        physicalSection: "",
        copiesAvailable: 0,
        copiesReserved: 0,
    });

    const handleBook = (e) => {
        const {id, value} = e.target;
        const numberField = ["publicationYear","copiesAvailable","copiesReserved"];
        setNewBook(prev=>({
            ...prev,
            [id]: numberField.includes(id) ? Number(value) : value,
        }))
    }

    const addBook = async(e) => {
        e.preventDefault();
        setResponseUid(0);
        if (Object.values(newBook).some(val=> val.toString().trim()==="") || newBook.publicationYear === 0) {
            alert(`Please fill in all fields before submitting.`);
        } else {
            try {
                const res = await axios.post(baseUrl+"/api/book/new",newBook);
                if (res.status === 200 && res.data.title === newBook.title) {
                    setResponseUid(res.data.uid);
                    setNewBook({
                        isbn: "",
                        title: "",
                        publicationYear: 0,
                        author: "",
                        category: "",
                        physicalSection: "",
                        copiesAvailable: 0,
                        copiesReserved: 0,
                    });
                } else {
                    alert('Something went wrong, please try again.');
                }
            } catch {
                alert('Server/axios error occured, please try again.');
            }
        }
    }

    if (user.isAdmin) {
        return (<>
            <Navbar/>
            <div className="container">
                <h1 className="windowheader">Add Books</h1>
                <div className="windowcontent">
                    <form onSubmit={addBook} className="inputbox">
                        <label htmlFor="isbn">ISBN</label><input type="text" id="isbn" value={newBook.isbn} onChange={handleBook}/>
                        <label htmlFor="title">Title</label><input type="text" id="title" value={newBook.title} onChange={handleBook}/>
                        <label htmlFor="publicationYear">Year of Publication</label><input type="number" id="publicationYear" value={newBook.publicationYear===0? "":newBook.publicationYear} onChange={handleBook}/>
                        <label htmlFor="author">Author</label><input type="text" id="author" value={newBook.author} onChange={handleBook}/>
                        <label htmlFor="category">Category</label><input type="text" id="category" value={newBook.category} onChange={handleBook}/>
                        <label htmlFor="physicalSection">Physical Location</label><input type="text" id="physicalSection" value={newBook.physicalSection} onChange={handleBook}/>
                        <label htmlFor="copiesAvailable">Available Copies</label><input type="number" id="copiesAvailable" value={newBook.copiesAvailable} onChange={handleBook}/>
                        <label htmlFor="copiesReserved">Reserved Copies</label><input type="number" id="copiesReserved" value={newBook.copiesReserved} onChange={handleBook}/>
                        <button className="submitbutton">Add Book</button>
                    </form>
                    <div className="report">{responseUid===0?"":`Book successfully added under uid ${responseUid}.`}</div>
                    {/* <div className="report">testing book added</div> */}
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