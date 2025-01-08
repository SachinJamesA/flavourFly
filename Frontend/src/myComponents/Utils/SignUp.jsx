import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from 'react-icons/io5'; // Import an arrow back icon

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phone: "",
    avatar: null,
    password: "",
    confirmPassword: "",
    address: "",
    deliveryArea: "",
    role: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Create FormData object
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(key, value);
        }
      });

      // Send request
      const response = await axios.post("/v1/users/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md mt-2">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-500 hover:text-blue-600 mb-4"
        >
          <IoArrowBack className="mr-2" size={20} />
          Back
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">Signup</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <InputField
            label="Username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Full Name */}
          <InputField
            label="Full Name"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          {/* Phone */}
          <InputField
            label="Phone Number"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium mb-1">Avatar</label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Confirm Password */}
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* Address */}
          <InputField
            label="Address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
          />

          {/* Delivery Area */}
          <InputField
            label="Delivery Area (Optional)"
            name="deliveryArea"
            type="text"
            value={formData.deliveryArea}
            onChange={handleChange}
          />

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
              <option value="deliveryPerson">Delivery Person</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, name, type, value, onChange, required }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required={required}
    />
  </div>
);

export default Signup;
