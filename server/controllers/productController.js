import Product from '../models/productModel.js';
import products from '../data.js';

// @desc   Seed products into the database
// @route  POST /api/products/seed
// @access Public (or Admin in a real app)
const seedProducts = async (req, res) => {
    try {
        await Product.deleteMany({});
        const createdProducts = await Product.insertMany(products);
        res.status(201).json(createdProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error seeding products', error: error.message });
    }
};

// @desc   Fetch all products with optional filters
// @route  GET /api/products
// @access Public
const getProducts = async (req, res) => {
    try {
        const { category, maxPrice, sortBy } = req.query;
        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (maxPrice) {
            filter.price = { $lte: Number(maxPrice) };
        }

        let sortOrder = {};
        if (sortBy === 'price-asc') {
            sortOrder.price = 1;
        } else if (sortBy === 'price-desc') {
            sortOrder.price = -1;
        }

        const products = await Product.find(filter).sort(sortOrder);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

export { getProducts, seedProducts };
