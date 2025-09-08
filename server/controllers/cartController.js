import { Clerk } from '@clerk/clerk-sdk-node';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

// Initialize Clerk
const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// Helper function to get or create a user in our DB with added logging
const getOrCreateUser = async (clerkId) => {
    console.log(`[getOrCreateUser] Starting for clerkId: ${clerkId}`);

    const user = await User.findOneAndUpdate(
        { clerkId: clerkId },
        { $setOnInsert: { clerkId: clerkId } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('[getOrCreateUser] User found or created in DB.');

    if (!user.email) {
        console.log('[getOrCreateUser] User email not found, fetching from Clerk...');
        try {
            const clerkUser = await clerk.users.getUser(clerkId);
            console.log('[getOrCreateUser] Fetched user details from Clerk.');
            user.email = clerkUser.emailAddresses[0].emailAddress;
            await user.save();
            console.log('[getOrCreateUser] User email saved to DB.');
        } catch (error) {
            console.error("[getOrCreateUser] Could not fetch/save user details from Clerk:", error);
        }
    } else {
        console.log('[getOrCreateUser] User email already exists.');
    }

    console.log(`[getOrCreateUser] Returning user document.`);
    return user;
};


// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
// @access  Private
const getCart = async (req, res) => {
    console.log(`[getCart] >>>>> REQUEST RECEIVED FOR USER: ${req.userId}`);
    try {
        // We will find the user directly here instead of using the helper
        // This helps isolate the problem.
        const user = await User.findOne({ clerkId: req.userId });

        if (!user) {
            // If the user somehow doesn't exist yet, it might be the first login.
            // Let's create them and send back an empty cart.
            console.log('[getCart] User not found in DB. Creating now...');
            const newUser = await getOrCreateUser(req.userId);
            console.log('[getCart] New user created. Sending empty cart.');
            return res.status(200).json(newUser.cart); // Should be an empty array []
        }

        console.log(`[getCart] User found. Sending back cart with ${user.cart.length} items.`);
        // If the user exists, send their cart.
        res.status(200).json(user.cart);

    } catch (error) {
        console.error("!!! CRITICAL ERROR in getCart:", error);
        res.status(500).json({ message: "Server error while fetching cart." });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = await getOrCreateUser(req.userId);
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const existingItem = user.cart.find(item => item._id.equals(productId));

        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            user.cart.push({ ...product.toObject(), quantity: quantity || 1 });
        }

        await user.save();
        res.status(200).json(user.cart);
    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ message: "Error adding item to cart." });
    }
};


// @desc    Remove item from cart
// @route   POST /api/cart/remove
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await getOrCreateUser(req.userId);

        user.cart = user.cart.filter(item => !item._id.equals(productId));

        await user.save();
        res.json(user.cart);
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        res.status(500).json({ message: "Error removing item from cart." });
    }
};


// @desc    Update item quantity
// @route   POST /api/cart/update
// @access  Private
const updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = await getOrCreateUser(req.userId);

        const cartItem = user.cart.find(item => item._id.equals(productId));

        if (cartItem) {
            if (quantity > 0) {
                cartItem.quantity = quantity;
            } else {
                // Remove item if quantity is 0 or less
                user.cart = user.cart.filter(item => !item._id.equals(productId));
            }
        }

        await user.save();
        res.json(user.cart);
    } catch (error) {
        console.error("Error in updateQuantity:", error);
        res.status(500).json({ message: "Error updating item quantity." });
    }
};

export { addToCart, getCart, removeFromCart, updateQuantity };

