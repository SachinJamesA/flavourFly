import React, { useState, useEffect } from "react";

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/v1/users/getUserDetails", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (!data || !data.data) throw new Error("Invalid API response");
        setUser(data.data);
      } catch (err) {
        console.error(err.message || "Error fetching user data");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("/v1/restaurants/getAllRestaurants", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (!data || !data.data || !data.data.restaurants) throw new Error("Invalid API response");
        setRestaurants(data.data.restaurants);
      } catch (error) {
        console.error(error.message || "Error fetching restaurant data");
      }
    };

    fetchRestaurants();
  }, []);

  return user?.role === "Admin" ? (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center py-10 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-screen-md md:max-w-screen-lg mx-auto">
        <h2 className="text-4xl font-extrabold text-blue-600 text-center mb-6">Admin Profile</h2>

        {/* Personal Details */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg shadow">
            <h3 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">Personal Details</h3>
            <p className="text-lg">
              <span className="font-bold text-blue-600">Admin Name:</span> {user.username}
            </p>
            <p className="text-lg">
              <span className="font-bold text-blue-600">Email:</span> {user.email}
            </p>
          </div>

          {/* Restaurant Details */}
          <div className="bg-blue-50 p-6 rounded-lg shadow">
            <h3 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">Admin's Restaurant Details</h3>
            {restaurants.length > 0 ? (
              <div className="space-y-4">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant._id}
                    className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                  >
                    <p className="text-lg">
                      <span className="font-bold text-gray-700">Name:</span> {restaurant.restaurantName}
                    </p>
                    <p className="text-lg">
                      <span className="font-bold text-gray-700">Contact:</span> {restaurant.contact}
                    </p>
                    <p className="text-lg">
                      <span className="font-bold text-gray-700">Address:</span> {restaurant.restaurantAddress}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg text-gray-600">No restaurants available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100">
      <p className="text-lg font-semibold text-red-500 bg-white p-4 rounded-lg shadow">
        You do not have access to this page.
      </p>
    </div>
  );
};

export default AdminProfile;
