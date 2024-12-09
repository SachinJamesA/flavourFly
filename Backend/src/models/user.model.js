import mongoose, {Schema} from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    password: {
        type: String,
        required: [true, 'Pasword is required'],
    },
    refreshToken: {
        type: String
    },
    address: {
        type: String
    },
    // Fields for delivery person
    deliveryArea: {
        type: String, 
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

export const User = mongoose.model("User", userSchema);