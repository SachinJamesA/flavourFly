import mongoose, {Schema} from 'mongoose';

const orderSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        foodItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FoodItem',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
    }],
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Processing', 'Out for delivery', 'Delivered' ],
        default: 'Processing'
    },
    deliveryPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }, // Delivery person assigned
    address: {
        type: String,
        required: true
    },
}, {timestamps: true});

export const Order = mongoose.model('Order', orderSchema);