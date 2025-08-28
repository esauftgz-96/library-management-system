import { useState } from "react";
import axios from 'axios';
import { useAuth } from "../components/AuthHandler";
import { useNavigate, Link } from 'react-router-dom';
import { verifyPassword } from "../components/PasswordHandler";
import '../css/Login.css';

export const Login = () => {
    const {login, baseUrl} = useAuth();
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
        try {
            //remember: res await, then extract with .data
            const res = await axios.get(baseUrl+`/api/user/email/${email}`);
            const user = res.data;
            if (user) {
                const passwordCheck = await verifyPassword(password, user.passwordHashed);
                if (passwordCheck) {
                    alert('Login successful!');
                    login(user);
                    navigate('/homepage');
                } else {
                    alert('Email does not exist or password is wrong. Please try again.');
                    setEmail("");
                    setPassword("");
                }
            } else {
                alert('Email does not exist or password is wrong. Please try again.');
                setEmail("");
                setPassword("");
            }
        } catch {
            alert('Server/axios error occured, please try again.');
        }
    };

    return (
        <div className='containerlogin'>
            <h1 className='windowheader'>Login Page</h1>
            <div className='windowcontent'>
                <form onSubmit={handleSubmit} className="inputbox">
                    <label htmlFor="email">Email:</label> <input type="text" id="email" value={email} onChange={handleEmail}/>
                    <label htmlFor="password">Password:</label> <input type="password" id="password" value={password} onChange={handlePassword}/>
                    <button className='submitbutton'>Submit</button>
                </form>
                <Link to="/registration" className="link">No account? Register here.</Link>
            </div>
        </div>
    )
}

