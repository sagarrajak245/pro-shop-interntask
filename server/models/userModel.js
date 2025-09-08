import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    // Store the full product details to avoid extra database lookups later
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
});

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    cart: [cartItemSchema],
});

const User = mongoose.model('User', userSchema);
export default User;
