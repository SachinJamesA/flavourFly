import React from "react";
import Login from "../Utils/Login";
import MenuComponent from "../Utils/Menu"; // Adjust path as needed

const CustomerMenu = () => {
  return (
    <>
      {!localStorage.getItem("accessToken") ? (
        <>
          <div className="mt-3 mb-4">
            <h1>Login to access the menu.</h1>
          </div>
          <Login />
        </>
      ) : (
        <div>
          <h1>Menu</h1>
          <p>Welcome to the menu page!</p>
          {/* Assuming you have the restaurantId available */}
          <MenuComponent restaurantId="yourRestaurantIdHere" />
        </div>
      )}
    </>
  );
};

export default CustomerMenu;
