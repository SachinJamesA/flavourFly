import React from "react";

const AdminProfile = ({ user, restaurant }) => {
  console.log(user);  // Check what user contains
  console.log(user.data.role)

  return (
    user.data?.role === "Admin" ? (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Restaurant Admin Profile
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Personal Details</h3>
              <p>
                <strong>Admin Name:</strong> {user.data.username}
              </p>
              <p>
                <strong>Email:</strong> {user.data.email}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Restaurant Details</h3>
              <p>
                <strong>Restaurant Name:</strong> {restaurant.restaurantName}
              </p>
              <p>
                <strong>Phone:</strong> {user.data.contact}
              </p>
              <p>
                <strong>Address:</strong> {user.address}
              </p>
            </div>
          </div>
          <button
            onClick={() => console.log("Edit Profile Clicked")}
            className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>
    ) : (
      <div>You do not have access to this page.</div>
    )
  );
};

export default AdminProfile;
