import mongoose, {Schema} from 'mongoose';

const restaurantSchema = new Schema({
    restaurantName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    contact: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 0,
    },
    menu: [{
        type: mongoose.Schema.types.ObjectId,
        ref: "FoodItem",
    }]
}, {timestamps: true});

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);