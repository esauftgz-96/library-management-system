import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './components/AuthHandler';

import { Login } from './pages/Login';
import { Registration } from './pages/Registration';
import { HomePage } from './pages/HomePage';
import { Library } from './pages/Library';
import { UserProfile } from './pages/UserProfile';

function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={< />} /> */}
            <Route path="/homepage" element={<Login/>}/>
            <Route path="/registration" element={<Registration/>}/>
            {/* user functions */}
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/library" element={<Library />} />
            <Route path="/mybooks" element={<MyBooks />} />
            <Route path="/userprofile" element={<UserProfile />} />
            {/* admin functions, REMEMBER to check with useAuth() */}
            <Route path="/adminprofile" element={<AdminProfile />} />
            <Route path="/addbooks" element={<AddBooks />} />
            <Route path="/editbooks" element={<EditBooks />} />
            <Route path="/lendbooks" element={<LendBooks />} />
            <Route path="/returnbooks" element={<ReturnBooks />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
