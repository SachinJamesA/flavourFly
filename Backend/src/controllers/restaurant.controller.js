// Import necessary modules
import express, { response } from "express";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Restaurant } from "../models/restaurant.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { FoodItem } from "../models/foodItem.model.js";
import { Review } from "../models/review.model.js";

// Add a new restaurant
const addRestaurant = asyncHandler(async (req, res) => {
  // get restaurant details out of models
  const { restaurantName, restaurantAddress, menu, contact } = req.body;

  // validate inputs (whichever fields are required )
  if (!restaurantName || !restaurantAddress || !contact) {
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

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, restaurant, "Restaurant fetched successfully"));
});

// Delete a restaurant
const deleteRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // validate if the id is valid objectId
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid restaurant ID");
  }

  // Find and delete the restaurant
  const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

  if (!deletedRestaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  // return response
  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedRestaurant, "Restaurant deleted successfully")
    );
});

// update restaurants details
const updateRestaurants = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { restaurantName, restaurantAddress, contact, rating, menu } = req.body;

  // Check if the restaurant is already in the list
  const existingRestaurant = await Restaurant.findById(id);
  if (!existingRestaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  // Update the restaurant details
  const updatedRestaurant = await Restaurant.findByIdAndUpdate(
    id,
    {
      $set: {
        restaurantName: restaurantName || existingRestaurant.restaurantName,
        restaurantAddress:
          restaurantAddress || existingRestaurant.restaurantAddress,
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
    );
});

// Add a menu item to a restaurant
const addMenuItem = asyncHandler(async (req, res) => {
  const { id } = req.params; // Restaurant ID from params
  const { name, price, description, category, foodImage } = req.body; // Food item details from request body

  // Validate restaurant ID
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid restaurant ID");
  }

  // check for images check for avatar
  const imageLocalPath = req.files?.foodImage[0]?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Food Image is required");
  }

  // upload them to cloudinary, avatar
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

// Get all menu items of a restaurant
const getMenuItems = asyncHandler(async (req, res) => {
  // get restaurant id
  const { id } = req.params;

  // Validate the restaurant id
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid restaurant id");
  }

  // Find the restaurant and populate the menu
  const restaurant = await Restaurant.findById(id).populate({
    path: "menu",
    select: "name price description category foodImage", // Fields to include in the response
  });

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  // return the populated menu
  return res
    .status(200)
    .json(
      new ApiResponse(200, restaurant.menu, "Menu items fetched successfully")
    );
});

// Update a menu item
const updateMenuItem = asyncHandler(async (req, res) => {
  const { id } = req.params; // FoodItem id
  const { name, price, description, category, foodImage } = req.body; // Updated fields

  // Validate food item id
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid food item ID");
  }

  const foodItem = await FoodItem.findById(id);
  if (!foodItem) {
    throw new ApiError(404, "Food item not found");
  }

  // Check for optional updates
  if (name) foodItem.name = name;
  if (price) foodItem.price = price;
  if (description) foodItem.description = description;
  if (category) foodItem.category = category;

  // Handle food image update
  if (req.files?.foodImage) {
    const imageLocalPath = req.files.foodImage[0]?.path; // multer file path
    if (!imageLocalPath) {
      throw new ApiError(400, "Food Image upload failed");
    }

    // Upload to Cloudinary
    const foodImageUrl = await uploadOnCloudinary(imageLocalPath);
    if (!foodImageUrl) {
      throw new ApiError(500, "Failed to upload food image to Cloudinary");
    }

    foodItem.foodImage = foodImageUrl?.url || foodItem.foodImage; // Update food image URL
  } else if (foodImage) {
    // If foodImage is provided directly in body (base64 or URL), update it
    foodItem.foodImage = foodImage;
  }

  // Save updated food item
  await foodItem.save();

  return res
    .status(200)
    .json(new ApiResponse(200, foodItem, "Menu item updated successfully"));
});

// Delete a menu item
const deleteMenuItem = asyncHandler(async (req, res) => {
  const { id } = req.params; // FoodItem id

  // validate food item id
  if(!mongoose.isValidObjectId(id)){
    throw new ApiError(400, "Invalid food item ID");
  }

  // Find the food item to delete
  const foodItem = await FoodItem.findById(id);
  if (!foodItem) {
    throw new ApiError(404, "Food item not found");
  }

  // Find the restaurant that the food item belongs to
  const restaurant = await Restaurant.findOne({ menu: id });
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  // Remove the food item from the restaurant's menu
  restaurant.menu = restaurant.menu.filter(itemId => itemId.toString() !== id);
  await restaurant.save();

  // Delete the food item from the FoodItem collection
  await FoodItem.findByIdAndDelete(id);

  return res
  .status(200)
  .json(
    new ApiResponse(200, foodItem, "Menu item deleted successfully")
  )

})

// Search restaurant
const searchRestaurant = asyncHandler(async (req, res) => {
  const { search } = req.query; // Get the search query parameter

  // Validate if search term is provided
  if (!search) {
    return res.status(400).json({
      message: "Search term is required."
    });
  }

  // Perform the search query on your restaurant collection
  const restaurants = await Restaurant.find({
    $or: [
      { restaurantName: { $regex: search, $options: "i" } },
      { contact: { $regex: search, $options: "i" } },
    ]
  });

  // Return the results
  if (restaurants.length === 0) {
    return res.status(404).json({ message: "No restaurants found." });
  }

  return res.status(200).json({
    message: "Restaurants found",
    data: restaurants
  });
});

// Get featured restaurant

// Add a restaurant review
const addRestaurantReview = asyncHandler(async (req, res) => {
  const { id } = req.params; // Restaurant ID
  const { reviewerName, rating, comment } = req.body; // Review details

  // Validate restaurant ID
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid restaurant ID");
  }

  // Validate required fields for review
  if (!reviewerName || !rating || !comment) {
    throw new ApiError(
      400,
      "All fields (reviewerName, rating, comment) are required"
    );
  }

  // Find the restaurant
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  // Create a new review
  const newReview = await Review.create({
    reviewerName,
    rating,
    comment,
    restaurant: id, // Add restaurant reference
  });

  // Add the new review to the restaurant
  restaurant.reviews.push(newReview._id);
  await restaurant.save();

  // Return success response
  return res
   .status(201)
   .json(new ApiResponse(201, newReview, "Review added successfully"));
})

// Get reviews for a restaurant
const getReviews = asyncHandler(async (req, res) => {
  const { id } = req.params; // Restaurant id

  // Validate the restaurant id
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid restaurant id");
  }

  // Find the restaurant and populate the reviews
  const restaurant = await Restaurant.findById(id).populate("reviews");
  if(!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  // Return the reviews
  return res
   .status(200)
   .json(
      new ApiResponse(200, restaurant.reviews, "Reviews fetched successfully")
    );
});

// Update restaurant status
const updateRestaurantStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate the restaurant ID
  if(!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid restaurant id")
  }

  // Validate the status field
  if(!status){
    throw new ApiError(400, "Status is required")
  }

  // Find the restaurant and update it's status
  const restaurant = await Restaurant.findById(id);
  if(!restaurant) {
    throw new ApiError(404, "Restaurant not found")
  }

  restaurant.status = status; // Update the status
  await restaurant.save(); // Save changes to the database

  // Return success response
  return res
   .status(200)
   .json(new ApiResponse(200, restaurant, "Restaurant status updated successfully"));
})

// Upload restaurant images
// const uploadRestaurantImage = asyncHandler(async (req, res) => {
//   const { id } = req.params; // Restaurant ID

//   // Validate the restaurant ID
//   if (!mongoose.isValidObjectId(id)) {
//     throw new ApiError(400, "Invalid restaurant id");
//   }

//   // Find the restaurant
//   const restaurant = await Restaurant.findById(id);
//   if (!restaurant) {
//     throw new ApiError(404, "Restaurant not found");
//   }

//   // Check if file is uploaded
//   if(!req.file) {
//     throw new ApiError(400, "No image uploaded");
//   }

//   // Get the uploaded file URl
//   const imageURL = req.file?.coverImage[0]?.path;

//    if (!imageURL) {
//      throw new ApiError(400, "restaurant Image is required");
//    }
 
//    // upload them to cloudinary
//    const image = await uploadOnCloudinary(imageURL);

//    // Update the restaurant's image field
//    restaurant.coverImage = imageURL;
//    await restaurant.save();

//    // Return the updated restaurant
//    return res
//     .status(200)
//     .json(new ApiResponse(200, restaurant, "Restaurant image uploaded successfully"));
// })

export {
  addRestaurant,
  getAllRestaurants,
  getSingleRestaurant,
  deleteRestaurant,
  updateRestaurants,
  addMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
  searchRestaurant,
  addRestaurantReview,
  getReviews,
  updateRestaurantStatus,
  // uploadRestaurantImage
};
