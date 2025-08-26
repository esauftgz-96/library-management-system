import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthHandler";
import axios from 'axios';
import { Navbar } from "../components/Navbar";
import '../css/PagesWithTables.css';

export const Library = () => {
    const {baseUrl} = useAuth();
    const [books, setBooks] = useState([]);
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
            getBooks(filter.title,filter.author,filter.category); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
        },[refresh]
    );

    const handleRefreshAll = () => {
        setFilter({
            title:"",
            author:"",
            category:"",
        });
        setRefresh(prev=>prev+1);
    };

    const handleRefreshFilter = () => {
        setRefresh(prev=>prev+1);
    };

    const handleFilter = (e) => {
        const {id, value} = e.target;
        setFilter(prev=>({
            ...prev,
            [id]:value,
        }));
    }

    return (<>
        <Navbar/>
        <div className="container">
            <h1 className="windowheader">Book List</h1>
            <div className="windowcontent">
                <button onClick={handleRefreshAll} className="submitbutton">Show All Books</button>
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
                            </tr>
                        ))
                    }
                </tbody>
                
            </table>
        </div>
    </>)
}