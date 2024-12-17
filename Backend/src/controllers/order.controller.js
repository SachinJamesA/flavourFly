import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Restaurant } from "../models/restaurant.model.js";
import { FoodItem } from "../models/foodItem.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import PDFDocument from "pdfkit";

// Place a new order
const placeOrder = asyncHandler(async (req, res) => {
  // Restaurant Id and Order items
  const { restaurantId, items, address } = req.body;

  // Validate restaurantId
  if (!mongoose.isValidObjectId(restaurantId)) {
    throw new ApiError(400, "Invalid restaurant id");
  }

  // Check if the restaurant exists
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  // Validate items array
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Order items are required");
  }

  let totalAmount = 0;

  // Validate each item and calculate the total amount
  for (const item of items) {
    const { foodItemId, quantity } = item;

    // Validate food item ID
    if (!mongoose.isValidObjectId(foodItemId)) {
      throw new ApiError(400, `Invalid food item id; ${foodItemId}`);
    }

    // Check if the food item exists
    const foodItem = await FoodItem.findById(foodItemId);
    if (!foodItem) {
      throw new ApiError(404, `Food item not found; ${foodItemId}`);
    }

    if (quantity <= 0) {
      throw new ApiError(
        400,
        "Quantity for ${foodItem.name} must be greater than zero"
      );
    }

    // Calculate total amount
    totalAmount += foodItem.price * quantity;
  }

  // Create a new order
  const newOrder = await Order.create({
    customer: req.user._id,
    restaurant: restaurantId,
    items: items.map((item) => ({
      foodItem: item.foodItemId,
      quantity: item.quantity,
    })),
    totalAmount,
    address,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newOrder, "Order placed successfully"));
});

// Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("customer", "username email") // Poplate customer details
    .populate("restaurant", "restaurantName restaurantAddress") // populate restaurant details
    .sort({ createdAt: -1 }); // Sort  by latest orders first

  if (!orders || orders.length === 0) {
    return res.status(404).json(new ApiResponse(404, [], "No orders found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

// Get a single order
const getSingleOrder = asyncHandler(async (req, res) => {
  // Order id from the request parameters
  const { id } = req.params;

  // Validate the order ID
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid order id");
  }

  // Find the order by ID
  const order = await Order.findById(id)
    .populate("customer", "username email") // Populate customer details
    .populate("restaurant", "restaurantName restaurantAddress") // Populate restaurant details
    .populate("items.foodItem", "name price"); // Populate food item details

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Return the order details
  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order details fetched successfully"));
});

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params; // Order id
  const { status } = req.body; // New status for the order

  // Validate the order ID
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid order id");
  }

  // Validate the status field
  const validStatuses = [
    "Pending",
    "Confirmed",
    "In Progress",
    "Completed",
    "Cancelled",
  ];
  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(
      400,
      `Invalid status. Status must be one of the following: ${validStatuses.join(
        ", "
      )}`
    );
  }

  // Find the order by id
  const order = await Order.findByIdAndUpdate(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Update the status of the order
  order.status = status;
  await order.save();

  // return the updated order
  res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

// cancel an order
const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params; // Order id

  // Validate the order ID
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid order id");
  }

  // Find the order by id
  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Check if the order is already completed or canceled
  if (["Completed", "Cancelled"].includes(order.status)) {
    throw new ApiError(
      400,
      `Order cannot be cancelled as it is already ${order.status}`
    );
  }

  // Update the ststus to cancel
  order.status = "Cancelled";
  await order.save();

  // return the updated order
  res
    .status(200)
    .json(new ApiResponse(200, order, "Order cancelled successfully"));
});

// get orders for users
const getOrdersForUsers = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch orders for logged in users
  const orders = await Order.find({ customer: userId }).populate(
    "items.foodItem",
    "name price"
  );

  if (!orders || orders.length === 0) {
    throw new ApiError(404, "No Orders found for this user");
  }

  // return orders
  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

// Get orders for restaurant
const getOrdersForRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the restaurant ID
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid restaurant id");
  }

  // Check if the restaurant exists
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  // Get all orders for the restaurant
  const orders = await Order.find({ restaurant: id })
    .populate("customer", "username email")
    .populate("items.foodItem", "name price");

  // Return the orders
  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

// add a review to the order
const addOrderReview = asyncHandler(async (req, res) => {
  const { id } = req.params; // id of the order
  const { review, rating } = req.body; // review and rating
  const userId = req.user._id;

  // validate order id
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid order id");
  }

  // Validte review and rating
  if (!review || !rating) {
    throw new ApiError(400, "Both Review and rating are required");
  }
  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  // Find the order by id
  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Ensure the logged-in user is the customer who placed the order.
  if (order.customer.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to add review");
  }

  // Add review and rating to the order
  order.review = review;
  order.rating = rating;
  await order.save();

  // Return success response
  return res
    .status(200)
    .json(new ApiResponse(200, order, "Review added successfully"));
});

// Track order
const trackOrder = asyncHandler(async (req, res) => {
  const { id } = req.params; // id of the order
  const userId = req.user._id;

  // Validate order id
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid order id");
  }

  // Find the order
  const order = await Order.findById(id).populate("restaurant items.foodItem");
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Ensure the logged-in user is the customer who placed the order
  if (order.customer.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to track this order");
  }

  // Return order details including status
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        status: order.status,
        order,
      },
      "Order status retrieved successfully"
    )
  );
});

// Generate invoice for order
const generateInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params; // id of the order

  // Validate order id
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid order id");
  }

  // Find the order
  const order = await Order.findById(id)
    .populate("customer", "username email")
    .populate("restaurant", "restaurantName restaurantAddress")
    .populate("items.foodItem", "name price");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Generate invoice data
  const invoiceData = {
    orderId: order._id,
    customerName: order.customer.username,
    customerEmail: order.customer.email,
    restaurantName: order.restaurant.restaurantName,
    items: order.items.map((item) => ({
      name: item.foodItem.name,
      price: item.foodItem.price,
      quantity: item.quantity,
      total: item.foodItem.price * item.quantity,
    })),
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt,
  };

  // Check query parameters for format (JSON or PDF)
  const format = req.query.format || "json"; // Default to JSON

  if (format === "pdf") {
    // Generate PDF
    const doc = new PDFDocument();
    const fileName = `invoice-${order._id}.pdf`;

    // Set response headers
    res.setHeader("Contnt-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Pipe the pdf to response
    doc.pipe(res);

    // Add content to the PDF
    doc
      .fontSize(20)
      .text(`Invoice for Order ${order._id}`, { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Customer: ${invoiceData.customerName}`);
    doc.text(`Email: ${invoiceData.customerEmail}`);
    doc.text(`Restaurant: ${invoiceData.restaurantName}`);
    doc.moveDown();

    // Add items
    invoiceData.items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name} - $${item.price} x ${item.quantity} = $${
          item.total
        }`
      );
    });

    doc.moveDown();
    doc.text(`Total Amount: $${invoiceData.totalAmount}`);
    doc.text(`Order Status: ${invoiceData.status}`);
    doc.text(`Order Date: ${invoiceData.createdAt}`);
    doc.end();
  } else {
    // Return JSON response
    return res
      .status(200)
      .json(
        new ApiResponse(200, invoiceData, "Invoice generated successfully")
      );
  }
});

// Get active orders from restaurant
const getActiveOrdersForRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params; // Restaurant ID from params

  // Validate the restaurant ID
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid restaurant ID");
  }

  // Fetch active orders for the restaurant (status: Pending, Preparing, Out for delivery)
  const activeOrders = await Order.find({
    restaurant: id,
    status: { $in: ["Pending", "Preparing", "Out for delivery"] },
  })
    .populate("customer", "username email") // Populate customer info
    .populate("restaurant", "restaurantName") // Populate restaurant info
    .populate("items.foodItem", "name price") // Populate food item info
    .sort({ createdAt: -1 }); // Sort by most recent orders

  // Check if no active orders found
  if (activeOrders.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No active orders found"));
  }

  // Return the active orders for the restaurant
  return res
    .status(200)
    .json(
      new ApiResponse(200, activeOrders, "Active orders retrieved successfully")
    );
});

// Get completed orders
const getCompletedOrdersForRestaurant = asyncHandler(async (req, res) => {
    const { id } = req.params; // Restaurant ID from params
  
    // Validate the restaurant ID
    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, "Invalid restaurant ID");
    }
  
    // Fetch completed orders for the restaurant (status: Completed, Delivered)
    const completedOrders = await Order.find({
      restaurant: id,
      status: { $in: ["Completed", "Delivered"] }, // Change this to your specific completed statuses
    })
      .populate("customer", "username email") // Populate customer info
      .populate("restaurant", "restaurantName") // Populate restaurant info
      .populate("items.foodItem", "name price") // Populate food item info
      .sort({ createdAt: -1 }); // Sort by most recent orders
  
    // Check if no completed orders found
    if (completedOrders.length === 0) {
      return res.status(200).json(new ApiResponse(200, [], "No completed orders found"));
    }
  
    // Return the completed orders for the restaurant
    return res.status(200).json(new ApiResponse(200, completedOrders, "Completed orders retrieved successfully"));
  });
  

// Assign delivery person

export {
  placeOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  cancelOrder,
  getOrdersForUsers,
  getOrdersForRestaurant,
  addOrderReview,
  trackOrder,
  generateInvoice,
  getActiveOrdersForRestaurant,
  getCompletedOrdersForRestaurant
};
