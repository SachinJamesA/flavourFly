import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        foodItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FoodItem",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"],
      default: "Processing",
    },
    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, // Delivery person assigned
    address: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    review: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
