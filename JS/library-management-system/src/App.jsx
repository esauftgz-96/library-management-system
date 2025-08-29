import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './components/AuthHandler';

import { Login } from './pages/Login';
import { Registration } from './pages/Registration';
import { HomePage } from './pages/HomePage';
import { Library } from './pages/Library';
import { MyBooks } from './pages/MyBooks';
import { UserProfile } from './pages/UserProfile';
import { SearchUser } from './pages/SearchUser';
import { AdminProfile } from './pages/AdminProfile';
import { AddBooks } from './pages/AddBooks';
import { EditBooks } from './pages/EditBooks';
import { LendBooks } from './pages/LendBooks';
import { RenewLoan } from './pages/RenewLoan';
import { Overdue } from './pages/Overdue';

function App() {
  console.log('App start.')

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={< />} /> */}
            <Route path="/" element={<Login/>}/>
            <Route path="/registration" element={<Registration/>}/>
            {/* user functions */}
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/library" element={<Library />} />
            <Route path="/mybooks" element={<MyBooks />} />
            <Route path="/userprofile" element={<UserProfile />} />
            {/* admin functions, REMEMBER to check with useAuth() */}
            <Route path="/searchuser" element={<SearchUser />} />
            <Route path="/adminprofile" element={<AdminProfile />} />
            <Route path="/addbooks" element={<AddBooks />} />
            <Route path="/editbooks" element={<EditBooks />} />
            <Route path="/lendbooks" element={<LendBooks />} />
            <Route path="/renewloan" element={<RenewLoan />} />
            <Route path="/overdue" element={<Overdue />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
