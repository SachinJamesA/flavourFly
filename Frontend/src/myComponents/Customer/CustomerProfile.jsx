import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import AdminProfile from "../Admin/AdminProfile";

const CustomerProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/v1/users/getUserDetails", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data || !data.data) {
          throw new Error("Invalid response: Missing user data.");
        }

        setUser(data.data);
      } catch (err) {
        setError(err.message || "An error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    user && (
      <div className="flex flex-col items-center bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-10">
        {/* Back Button */}
        <button
          className="self-start mb-4 flex items-center text-gray-700 hover:text-gray-900"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        {/* Avatar and Welcome Message */}
        <div className="flex flex-col items-center mb-8">
          {user.avatar ? (
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg">
              <img
                src={user.avatar}
                alt={`${user.username || "User"}'s avatar`}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-40 h-40 rounded-full bg-gray-300 text-gray-600 text-lg shadow-lg">
              No Image
            </div>
          )}
          <h1 className="text-3xl font-bold mt-4 text-indigo-700">
            Hello, {user.username || "Guest"}!
          </h1>
          <p className="text-gray-600 mt-1">Welcome back to your profile</p>
        </div>

        {/* User Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-4">
          {[{
            label: "Email", value: user.email,
          }, {
            label: "Full Name", value: user.fullName,
          }, {
            label: "Phone", value: user.phone,
          }, {
            label: "Address", value: user.address,
          }, {
            label: "Role", value: user.role || "User",
          }, {
            label: "Joined",
            value: user.createdAt
              ? new Date(user.createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Not Provided",
          }].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-gray-700 font-semibold">
                <strong>{label}:</strong> {value || "Not Provided"}
              </p>
            </div>
          ))}
        </div>

        {/* Admin Profile Section */}
        {user.role === "Admin" && (
          <div className="mt-10 w-full">
            <AdminProfile />
          </div>
        )}

        {/* Edit Button */}
        <div className="mt-8">
          <button
            className="flex items-center px-5 py-3 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
            onClick={() => navigate("/editprofile")}
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </button>
        </div>
      </div>
    )
  );
};

export default CustomerProfile;
