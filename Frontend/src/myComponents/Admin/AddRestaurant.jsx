import React, { useState } from "react";
import axios from "axios";
import { IoArrowBack } from 'react-icons/io5'; // Import an arrow back icon
import { useNavigate } from "react-router-dom";

const AddRestaurant = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        restaurantName: "",
        restaurantAddress: "",
        // cuisine: "",
        // openingHours: "",
        contact: "",
        // website: "",
        coverImage: null,
    });

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData({ ...formData, image: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            // Create FormData object to handle file uploads
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value) {
                    formDataToSend.append(key, value);
                }
            });

            // Send POST request
            const response = await axios.post("/v1/restaurants/addRestaurant", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSuccessMessage("Restaurant added successfully!");
            setFormData({
                restaurantName: "",
                restaurantAddress: "",
                // cuisine: "",
                // openingHours: "",
                contact: "",
                // website: "",
                coverImage: null,
            });
        } catch (err) {
            setError(err.response?.data?.error || "Failed to add restaurant. Try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
                {/* Back Button */}
                        <button
                          onClick={() => navigate(-1)}
                          className="flex items-center text-blue-500 hover:text-blue-600 mb-4"
                        >
                          <IoArrowBack className="mr-2" size={20} />
                          Back
                        </button>
                <h2 className="text-2xl font-bold text-center mb-6">Add Restaurant</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <InputField
                        label="Restaurant Name"
                        name="restaurantName"
                        type="text"
                        value={formData.restaurantName}
                        onChange={handleChange}
                        required
                    />

                    {/* Location */}
                    <InputField
                        label="Location"
                        name="restaurantAddress"
                        type="text"
                        value={formData.restaurantAddress}
                        onChange={handleChange}
                        required
                    />

                    {/* Cuisine */}
                    {/* <InputField
                        label="Cuisine Type"
                        name="cuisine"
                        type="text"
                        value={formData.cuisine}
                        onChange={handleChange}
                        required
                    /> */}

                    {/* Opening Hours */}
                    {/* <InputField
                        label="Opening Hours (e.g., 9 AM - 10 PM)"
                        name="openingHours"
                        type="text"
                        value={formData.openingHours}
                        onChange={handleChange}
                    /> */}

                    {/* Phone */}
                    <InputField
                        label="Phone Number"
                        name="contact"
                        type="text"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                    />

                    {/* Website */}
                    {/* <InputField
                        label="Website (Optional)"
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleChange}
                    /> */}

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Restaurant Image</label>
                        <input
                            type="file"
                            name="coverImage"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                    >
                        Add Restaurant
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

export default AddRestaurant;
