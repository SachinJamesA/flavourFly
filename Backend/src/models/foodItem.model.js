import mongoose, {Schema} from 'mongoose';

const foodItemSchema = new Schema({
    name: {
        type: String,
        required: true, 
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    foodImage: {
        type: String,
        required: true,
        trim: true
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
}, {timestamps: true});

export const FoodItem = mongoose.model("FoodItem", foodItemSchema);