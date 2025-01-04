import { mongoose } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token and refresh token"
    );
  }
};

// Register user
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // Validation - not empty
  // check if user already exists: username, email
  // check for images check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in DB
  // remove password and refresh token field from response
  // check for user creation
  // return response if not send error

  // get user details from frontend
  const { username, email, fullName, password, phone, address } = req.body;
  // console.log(phone);

  // Validation - not empty
  if (
    [fullName, email, username, password, phone, address].some(
      (field) => field?.trim() === " "
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists: username, email
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(400, "Username or email already exists");
  }

  //   check for images check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }

  // upload them to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  // create user object - create entry in DB
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    email,
    password,
    username,
    phone,
    address
  });

  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Internal server error");
  }

  // return response if not send error
  return res
    .json(new ApiResponse( 200, createdUser, "User registered successfully"));
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInuser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  // Set cookies and send response
  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);
  // return res.json(
  //   new ApiResponse(
  //     200,
  //     {
  //       user: loggedInuser,
  //       accessToken,
  //       refreshToken,
  //     },
  //     "User Logged In Successfully"
  //   )
  // );
  return res.status(200).json({
    user: loggedInuser,
    accessToken,
    refreshToken,
  });
});


// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  // Need to clear the cookies
  // Need to remove refresh token
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse( {}, "User Logged Out"));
});

// get user details
const getUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Validate the user id
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  // find the users in the database
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Return the user details
  return res
    .json(new ApiResponse(200, user, "User details fetched successfully"));
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Validate the user id
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(404, "User not found");
  }

  // Find the user 
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Destructure fields from request body
  const { username, email, phone, address, fullName } = req.body;
  let avatar = user.avatar; // Default to current avatar if not updated

  // Check if there's an avatar in the request and handle file upload
  if (req.files && req.files.avatar) {
    const avatarFile = req.files.avatar;

    // Validate file type and size (optional)
    if (!avatarFile.mimetype.startsWith('image/')) {
      throw new ApiError(400, "Only image files are allowed");
    }
    if (avatarFile.size > 5 * 1024 * 1024) { // Limit to 5MB
      throw new ApiError(400, "Image size should not exceed 5MB");
    }

    // Save the file to a directory or cloud storage
    const filePath = `/uploads/avatars/${Date.now()}-${avatarFile.name}`; // For example, local directory path
    avatarFile.mv(path.join(__dirname, '..', 'public', filePath), (err) => {
      if (err) {
        throw new ApiError(500, "Error uploading avatar");
      }
    });

    avatar = filePath; // Update avatar field with the file path
  }

  // Update user fields
  if (username) user.username = username;
  if (fullName) user.fullName = fullName;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (address) user.address = address;
  if (avatar) user.avatar = avatar;

  // Save the updated user profile
  const updatedUser = await user.save();

  // Return the response
  return res.status(200).json(new ApiResponse(200, updatedUser, "User profile updated successfully"));
});


// change password
const changePass = asyncHandler(async(req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
})

// Forget password
// Reset password
// Delete user account
// Get all users (admin)
// Update user role (admin)
// Ban/Unban user (admin)

export {
  registerUser,
  loginUser,
  generateAccessAndRefreshToken,
  logoutUser,
  getUserDetails,
  updateProfile,
  changePass,
};
