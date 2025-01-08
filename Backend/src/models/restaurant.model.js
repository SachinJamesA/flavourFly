import mongoose, { Schema } from 'mongoose';

const restaurantSchema = new Schema(
  {
    restaurantName: {
      type: String,
      required: true,
      trim: true,
      index: true, // Add case insensitive index for queries if necessary
      lowercase: true,
    },
    restaurantAddress: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\+?[0-9\s\-]+$/.test(v); // Validates phone numbers with optional '+' and spacing/dashes
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    menu: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodItem",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      }
    ],
    coverImage: {
      type: String, // URL for the restaurant cover image
      default: "",
    },
    status: {
      type: String,
      // required: true,
      enum: ["available", "Closed"]
    }
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
