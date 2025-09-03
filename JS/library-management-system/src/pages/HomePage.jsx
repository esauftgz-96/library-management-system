import { useEffect } from "react";
import { useAuth } from "../components/AuthHandler";
import { Navbar } from "../components/Navbar";
import { overdueCalc } from "../components/MathComponents";
import axios from 'axios';
import '../css/HomePage.css'

export const HomePage = () => {
    const {user,baseUrl,maxLoanPeriod,penaltyPerDay,maxFinePenalty} = useAuth();

    useEffect(
        ()=>{
            overdueAlert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    );

    const overdueAlert = async() => {
        try {
            const res = await axios.get(baseUrl+`/api/lending/userid/${user.uid}`);
            const totalFines = res.data.filter(lend=>lend.returnDate==null).reduce((acc,val)=>acc+overdueCalc(val.borrowDate,maxLoanPeriod,penaltyPerDay,maxFinePenalty),0);
            if (totalFines>0) {
                alert(`You have a pending overdue of $${totalFines.toFixed(2)}. Please check the full details in My Books.`);
            } else {
                return;
            }
        } catch {
            console.log("Overdue obtain failed");
        }
    }

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