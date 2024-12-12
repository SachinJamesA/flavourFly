// Import necessary modules
import express, { response } from "express";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Restaurant } from "../models/restaurant.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Add a new restaurant
const addRestaurant = asyncHandler(async (req, res) => {
  // get restaurant details out of models
  const { restaurantName, restaurantAddress, menu, contact } = req.body;

  // validate inputs (whichever fields are required )
  if (!restaurantName || !restaurantAddress || !menu || !contact) {
    throw new ApiError(400, "All fields are required");
  }

  // check if restaurant with same name and address already exists
  const existingRestaurant = await Restaurant.findOne({
    restaurantName,
    restaurantAddress,
  });
  if (existingRestaurant) {
    throw new ApiError(
      400,
      "Restaurant with same name and address already exists"
    );
  }

  // Handle image uploads
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // create new restaurant entry in database
  const newRestaurant = await Restaurant.create({
    restaurantName,
    restaurantAddress,
    menu,
    contact,
    coverImage: coverImage?.url || "",
  });

  // Check if the new restaurant is created
  if (!newRestaurant) {
    throw new ApiError(500, "Failed to create restaurant");
  }

  // return response success if not failed to add restaurant
  return res
    .status(201)
    .json(
      new ApiResponse(201, newRestaurant, "New Restaurant created successfully")
    );
});

// Get all rerstaurants
const getAllRestaurants = asyncHandler(async (req, res) => {
  // Optionally query parameters for filtering, sorting, and pagination.
  const {
    search,
    page = 1,
    limit = 10,
    sortBy = "reting",
    order = "desc",
  } = req.query;

  // Build query filters
  const filters = {}; // Initialize an empty filters object
  if (search) {
    filters.$or = [
      // $or checks if any one of the condition matches
      {
        restaurantName: { $regex: search, $options: "i" },
        // $options: "i" makes the search case-insensitive,
      },
      {
        contact: { $regex: search, $options: "i" },
      },
    ];
  }

  // Pagination setup
  const skip = (page - 1) * limit;

  // fetch data from database with filters, sorting, and pagination
  const restaurants = await Restaurant.find(filters)
    .sort({ [sortBy]: order === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(Number(limit));

  // get total count of restaurants for pagination
  const totalRestaurants = await Restaurant.countDocuments(filters);

  if (!restaurants || restaurants.length === 0) {
    throw new Error(400, "No restaurants found");
  }

  // return response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        restaurants,
        currentPage: Number(page),
        totalPages: Math.ceil(totalRestaurants / limit),
        totalRestaurants,
      },
      "Restaurants fetched successfully"
    )
  );

});

// Get a single restaurant
const getSingleRestaurant = asyncHandler(async (req, res) => {
    // Get the single restaurant by its ID
    const { id } = req.params;

    // find the restaurant by its ID
    const restaurant = await Restaurant.findById(id);

    if(!restaurant) {
        throw new ApiError(404, "Restaurant not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            restaurant,
            "Restaurant fetched successfully"
        )
    )
})

// Delete a restaurant
const deleteRestaurant = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // validate if the id is valid objectId
    if(!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid restaurant ID");
    }

    // Find and delete the restaurant
    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

    if(!deletedRestaurant) {
        throw new ApiError(404, "Restaurant not found");
    }

    // return response
    return res
    .status(200) 
    .json(
        new ApiResponse(
            200,
            deletedRestaurant,
            "Restaurant deleted successfully"
        )
    )
})

// update restaurants details
const updateRestaurants = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { restaurantName, restaurantAddress, contact, rating, menu } = req.body;

    // Check if the restaurant is already in the list
    const existingRestaurant = await Restaurant.findById(id);
    if(!existingRestaurant) {
        throw new ApiError(404, "Restaurant not found");
    }

    // Update the restaurant details
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        id,
        {
            $set: {
                restaurantName: restaurantName || existingRestaurant.restaurantName,
                restaurantAddress: restaurantAddress || existingRestaurant.restaurantAddress,
                contact: contact || existingRestaurant.contact,
                rating: rating || existingRestaurant.rating,
                menu: menu || existingRestaurant.menu,
            },
        },
        {
            new: true,
            runValidators: true, 
        } // return the updated document
    );

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedRestaurant,
            "Restaurant details updated successfully"
        )
    )
})

// Add a menu item
// Update a menu item
// Delete a menu item
// Get all menu items of a restaurant
// Search restaurant
// Get featured restaurant
// Add a restaurant review
// Get reviews for a restaurant
// Update restaurant status
// Upload restaurant images

export { addRestaurant, getAllRestaurants, getSingleRestaurant, deleteRestaurant, updateRestaurants };
