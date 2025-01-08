import { useState, useEffect } from 'react';
import './App.css';
import CustomerMenu from './myComponents/Customer/CustomerMenu';
import CustomerOrder from './myComponents/Customer/CustomerOrder';
import CustomerProfile from './myComponents/Customer/CustomerProfile';
import EditProfile from './myComponents/Utils/EditProfile';
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
import AddRestaurant from './myComponents/Admin/AddRestaurant';
import AdminProfile from './myComponents/Admin/AdminProfile';
import axios from 'axios';

function App() {
  // const [currentUser, setCurrentUser] = useState(null);
  // const [restaurant, setRestaurant] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   // Replace with your API endpoint
  //   axios
  //     .get("/v1/users/getUserDetails")
  //     .then((response) => {
  //       setCurrentUser(response.data); // Assume response.data contains the user data
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setError("Failed to load user data.");
  //       setLoading(false);
  //     });
  // }, []);

  // useEffect(() => {
  //   axios.get("/v1/restaurants/singlerestaurant")
  //   .then((response) => {
  //     setRestaurant(response.data); // Assume response.data contains the user data
  //     setLoading(false);
  //   })
  //   .catch((err) => {
  //     setError("Failed to load user data.");
  //     setLoading(false);
  //   });
  // }, []);

  // if (loading) {
  //   return <p>Loading user...</p>;
  // }

  // if (error) {
  //   return <p>{error}</p>;
  // }


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
        <Route path='/editprofile' element={<EditProfile />}></Route>

        {/* <Route path='/adminprofile' element={<AdminProfile />}></Route> */}
        <Route path='/addrestaurant' element={<AddRestaurant />}></Route>
      </Routes>
    </Router>
  )
}

export default App
