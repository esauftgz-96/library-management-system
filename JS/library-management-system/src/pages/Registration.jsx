import { useNavigate, Link } from 'react-router-dom';
import { useState } from "react";
import axios from 'axios';
import { hashPassword } from '../components/PasswordHandler';
import { useAuth } from '../components/AuthHandler';
import '../css/Registration.css'

export const Registration = () => {
    const {baseUrl} = useAuth();
    const navigate = useNavigate();
    const [registrationForm, setRegistrationForm] = useState({
        //uid is auto increment
        name: "",
        birthday: "",
        address: "",
        email: "",
        contactNumber: "",
        password: "",
        //default - isAdmin: false, booksLent: 0, lastRegistered: null
    });

    const handleForm = (e) => {
        //name and email are from event (e) field with e.target
        const { id, value } = e.target;
        setRegistrationForm((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //Object.values(registrationForm).some(field => !field)
        if (registrationForm.name === "" || registrationForm.birthday === "" || registrationForm.address === "" || registrationForm.email === "" || registrationForm.contactNumber === "" || registrationForm.password === "") {
            alert('Please fill in any empty fields.');
        } else {
            try {
                const res = await axios.get(baseUrl+`/api/user/email/${registrationForm.email}`);
                if (res.data !== null) {
                    alert('Email already exists. Please try another email.');
                    setRegistrationForm((prev) => ({
                        ...prev,
                        email: "", 
                    }));
                } else {
                    const passwordHashed = await hashPassword(registrationForm.password);
                    const registrationRes = await axios.post(baseUrl+`/api/user/new`,{
                        name: registrationForm.name,
                        birthday: registrationForm.birthday,
                        address: registrationForm.address,
                        email: registrationForm.email,
                        contactNumber: registrationForm.contactNumber,
                        passwordHashed,
                    });
                    if (registrationRes.status === 200 && registrationRes.data.email === registrationForm.email) {
                        alert('Account created, please login.');
                        navigate("/");
                    } else {
                        alert('Something went wrong, try again.');
                    }
                }
            } catch {
                alert('Server/axios error occured, please try again.');
            }
        }
    };

    return (<div className="container">
        <h1 className='windowheader'>Registration Page</h1>
        <div className='windowcontent'>
            <form onSubmit={handleSubmit} className='inputbox'>
                <label htmlFor="name">Name:</label> <input type='text' id='name' value={registrationForm.name} onChange={handleForm}></input>
                <label htmlFor="birthday">Date of Birth:</label> <input type='date' id='birthday' value={registrationForm.birthday} onChange={handleForm}></input>
                <label htmlFor="address">Address:</label> <input type='text' id='address' value={registrationForm.address} onChange={handleForm}></input>
                <label htmlFor="email">Email:</label> <input type='text' id='email' value={registrationForm.email} onChange={handleForm}></input>
                <label htmlFor="contactNumber">Contact Number:</label><input type='text' id='contactNumber' value={registrationForm.contactNumber} onChange={handleForm}></input>
                <label htmlFor="password">Password:</label><input type='password' id='password' value={registrationForm.password} onChange={handleForm}></input>
                <button className='submitbutton'>Submit</button>
            </form>
            <Link to="/" className='link'>Have an account? Login here.</Link>
        </div>
    </div>)
}