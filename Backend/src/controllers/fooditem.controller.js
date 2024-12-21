import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Restaurant } from "../models/restaurant.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { FoodItem } from "../models/foodItem.model.js";

// Add a food item
const addFoodItem = asyncHandler(async (req, res) => {
  const { id } = req.params; // restaurant id
  const { name, price, description, category, foodImage } = req.body; // food item details from request body

  // Validate restaurant id
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(404, "Invalid restaurant id");
  }

  // Validate required fields
  if (!name || !price || !description || !category || !foodImage) {
    throw new ApiError(
      400,
      "All fields (name, price, description, category, foodImage) are required"
    );
  }

  // check for images
  const imageLocalPath = req.files?.foodImage[0]?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Food Image is required");
  }

  // upload them to cloudinary
  const image = await uploadOnCloudinary(imageLocalPath);

  // Validate required fields for food item
  if (!name || !price || !description || !category || !image) {
    throw new ApiError(
      400,
      "All fields (name, price, description, category, foodImage) are required"
    );
  }

  // Find the restaurant
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  // Create the new food item
  const newFoodItem = new FoodItem({
    name,
    price,
    description,
    category,
    foodImage: image.url,
    restaurant: id, // Add restaurant reference
  });

  // Save the new food item
  await newFoodItem.save();

  // Add the new food item to the restaurant's menu
  restaurant.menu.push(newFoodItem._id);
  await restaurant.save();

  // Return success response
  return res
    .status(201)
    .json(new ApiResponse(201, newFoodItem, "Menu item added successfully"));
});

// Get all food item
// get a single food item
// get  food items by restaurant
// Update a food item
// Delete a food item
// Search for food items
// Get featured food items
// Update food items availablility
// Add or update food items rating
// get food item by category

export { addFoodItem };
