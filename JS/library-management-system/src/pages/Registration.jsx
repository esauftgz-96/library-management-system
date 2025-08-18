import { useAuth } from "../components/AuthHandler";
import { useNavigate } from 'react-router-dom';

export const Registration = () => {
    const baseUrl = "http://localhost:8080"
    const {login} = useAuth();
    const navigate = useNavigate();
}