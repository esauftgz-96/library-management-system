import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../components/AuthHandler";
import '../css/NavBar.css';

export const Navbar = () => {
    const {user,logout} = useAuth();
    const navigate = useNavigate();

    const fullLogout = () => {
        logout();
        navigate("/");
    }

    return (<>
        <nav>
            <Link to="/homepage">Home Page</Link>
            <div className='dropdown'>
                <span>Library ▼</span>
                <div className='dropdown-content'>
                    <Link to="/library">Library</Link>
                    <Link to="/mybooks">My Books</Link>
                </div>
            </div>
            <Link to="/userprofile">Profile Details</Link>
            <div className='dropdown'>
                <span>Admin ▼</span>
                <div className='dropdown-content'>
                    <Link to="/searchuser">Search User</Link>
                    <Link to="/adminprofile">Edit User</Link>
                    <Link to="/addbooks">Add Books</Link>
                    <Link to="/editbooks">Edit Books</Link>
                    <Link to="/lendbooks">Loan Books</Link>
                    <Link to="/renewloan">Book Returns/Loan Renewal</Link>
                </div>
            </div>
            <div className='userstate'>
                <span>Current User: {user.name}</span> <button onClick={fullLogout}>Logout</button> 
            </div>
        </nav>
    </>)
}