import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from './pages/Login';
import { AuthProvider } from './components/AuthHandler';

function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={< />} /> */}
            <Route index element={<Login/>}/>
            <Route path="/registration" element={<Registration/>}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
