import { Link } from 'react-router-dom';

export const Navbar = () => {
    return (<>
        <nav>
            <Link to="/homepage">Home Page</Link>
            <div className='dropdown'>
                <span>Library ▼</span>
                <div className='dropdown-content'>
                    <Link to="/library">View All Books</Link>
                    <Link to="/mybooks">My Books</Link>
                </div>
            </div>
            <Link to="/userprofile">Update Profile</Link>
            <div className='dropdown'>
                <span>Admin ▼</span>
                <div className='dropdown-content'>
                    <Link to="/adminprofile">Edit User Profile</Link>
                    <Link to="/addbooks">Add Books</Link>
                    <Link to="/editbooks">Edit Books</Link>
                    <Link to="/lendbooks">Lend Books</Link>
                    <Link to="/returnbooks">Return Books</Link>
                </div>
            </div>
        </nav>
    </>)
}

// .dropdown {
//   display: inline-block;
//   position: relative;
// }

// .dropdown-content {
//   display: none;
//   position: absolute;
//   background: white;
//   border: 1px solid #ccc;
//   padding: 0.5rem;
//   top: 100%;
// }

// .dropdown:hover .dropdown-content {
//   display: block;
// }