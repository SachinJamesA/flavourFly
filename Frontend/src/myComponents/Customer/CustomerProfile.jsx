import React, { useEffect, useState } from "react";

const CustomerProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user details...");

        const response = await fetch("/v1/users/getUserDetails", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (!data || !data.data) {
          throw new Error("Invalid API response: Missing user data.");
        }

        setUser(data.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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
    user ? (
      <div className="flex flex-col items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-10">
        <div className="flex flex-col items-center mb-6">
          {user.avatar ? (
            <div className="group relative">
              <img
                src={user.avatar}
                alt={`${user.username || "User"}'s avatar`}
                className="rounded-full w-32 h-32 object-cover border-4 border-blue-500 shadow-md transform group-hover:scale-110 transition duration-300"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gray-300 text-gray-600 text-lg">
              No Image
            </div>
          )}
          <h1 className="text-3xl font-bold mt-4 text-indigo-700">
            Welcome, {user.username || "Guest"}!
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-4">
          <div className="flex flex-col items-start bg-white rounded-lg p-4 shadow">
            <p className="text-gray-600 font-semibold">
              <strong>Email:</strong> {user.email || "Not Provided"}
            </p>
          </div>
          <div className="flex flex-col items-start bg-white rounded-lg p-4 shadow">
            <p className="text-gray-600 font-semibold">
              <strong>Full Name:</strong> {user.fullName || "Not Provided"}
            </p>
          </div>
          <div className="flex flex-col items-start bg-white rounded-lg p-4 shadow">
            <p className="text-gray-600 font-semibold">
              <strong>Phone:</strong> {user.phone || "Not Provided"}
            </p>
          </div>
          <div className="flex flex-col items-start bg-white rounded-lg p-4 shadow">
            <p className="text-gray-600 font-semibold">
              <strong>Address:</strong> {user.address || "Not Provided"}
            </p>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-center h-screen text-lg text-gray-500">
        No user data available
      </div>
    )
  );
};

export default CustomerProfile;
