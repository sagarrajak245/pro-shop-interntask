import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db.js';
import cartRoutes from './routes/cartRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();
connectDB();

const app = express();

// --- CORS Configuration for Production ---
// This tells your server to only accept requests from your live frontend.
const corsOptions = {
    origin: 'https://pro-shop-interntask-frontend.onrender.com/',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Server running on port ${PORT}`)); 