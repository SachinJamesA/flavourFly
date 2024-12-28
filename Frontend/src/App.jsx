import './App.css';
import CustomerMenu from './myComponents/Customer/CustomerMenu';
import CustomerOrder from './myComponents/Customer/CustomerOrder';
import CustomerProfile from './myComponents/Customer/CustomerProfile';
import Home from './myComponents/Utils/Home';
import Login from './myComponents/Utils/Login';
import Navbar from './myComponents/Utils/Navbar';
import SignUp from './myComponents/Utils/SignUp';
import {
  BrowserRouter as Router,
  Route,
  Routes
  // Link
} from "react-router-dom";

function App() {

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} ></Route>
        <Route path="/signup" element={<SignUp />} ></Route>
        <Route path='/customermenu' element={<CustomerMenu />}></Route>
        <Route path='/customerorder' element={<CustomerOrder />}></Route>
        <Route path='/customerprofile' element={<CustomerProfile />}></Route>
      </Routes>
    </Router>
  )
}

export default App
