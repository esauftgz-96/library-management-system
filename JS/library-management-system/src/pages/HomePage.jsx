import { useAuth } from "../components/AuthHandler";
import { Navbar } from "../components/Navbar";

export const HomePage = () => {
    const {user} = useAuth();

    return (<>
        <Navbar/>
        <h1>Home Page</h1>
        <div>Welcome, {user.name}!</div>
        <div>Please use the navigation bar above to begin.</div>
    </>)
}