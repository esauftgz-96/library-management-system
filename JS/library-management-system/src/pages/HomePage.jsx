import { useAuth } from "../components/AuthHandler";
import { Navbar } from "../components/Navbar";
import '../css/HomePage.css'

export const HomePage = () => {
    const {user} = useAuth();

    return (<>
        <Navbar/>
        <div className="containerhome">
            <h1 className="windowheader">Home Page</h1>
            <div className="windowcontent">
                <div>Welcome, {user.name}!</div>
                <div>Please use the navigation bar above to begin.</div>
            </div>
        </div>
    </>)
}