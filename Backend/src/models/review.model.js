import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    reviewerName: {
        type: "String",
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    }, 
    comment: {
        type: String,
        required: true,
    },
}, {timestamps: true} );

export const Review = mongoose.model('Review', reviewSchema);