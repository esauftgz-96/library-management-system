import { useState } from "react";
import axios from 'axios';
import { useAuth } from "../components/AuthHandler";
import { useNavigate, Link } from 'react-router-dom';
import { verifyPassword } from "../components/PasswordHandler";


export const Login = () => {
    const baseUrl = "http://localhost:8080"
    const {login} = useAuth();
    const navigate = useNavigate();

    const[email,setEmail] = useState("");
    const[password,setPassword] = useState("");

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        //remember: res await, then extract with .data
        const res = await axios.get(baseUrl+`/email/${email}`);
        const user = res.data;
        const passwordCheck = await verifyPassword(password, user.passwordHashed)
        if (user && passwordCheck) {
            login(user);
            navigate('/main');
        } else {
            alert('Email does not exist or password is wrong. Please try again.');
            setEmail("");
            setPassword("");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" value={email} onChange={handleEmail}/>
                <input type="password" value={password} onChange={handlePassword}/>
                <button>Submit</button>
            </form>

            <Link to="/registration">No account? Register here.</Link>
        </>
    )
}

