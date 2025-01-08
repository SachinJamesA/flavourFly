import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import { IoArrowBack } from 'react-icons/io5'; // Import an arrow back icon

const ProfileEditor = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    fullName: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        '/v1/users/updateprofile', // Example endpoint
        profile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Add token for authorization if needed
          },
        }
      );
      setMessage(response.data.message); // Success message
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6 mt-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-500 hover:text-blue-600 mb-4"
      >
        <IoArrowBack className="mr-2" size={20} />
        Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring border-blue-500"
          ></textarea>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save
        </button>
      </div>
      {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ProfileEditor;
