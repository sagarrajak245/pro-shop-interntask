#!/bin/bash

# This script builds the entire React component and page structure for the Pro-Shop application.
# It should be run from the root 'pro-shop' directory.

echo "🚀 Building frontend structure inside the 'client' directory..."

# Check if the client directory exists
if [ ! -d "client" ]; then
    echo "❌ Error: 'client' directory not found. Please run the previous setup script first."
    exit 1
fi

cd client

# 1. Create folder structure
echo "Step 1: Creating folder structure (components, pages, store)..."
mkdir -p src/components src/pages src/store
echo "✅ Folder structure created."

# 2. Create Zustand store for the cart
echo "Step 2: Creating Zustand cart store..."
cat <<'EOF' > src/store/cartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.items.find((item) => item._id === product._id);
          if (existingItem) {
            // Increment quantity if item already exists
            const updatedItems = state.items.map((item) =>
              item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            );
            return { items: updatedItems };
          } else {
            // Add new item with quantity 1
            return { items: [...state.items, { ...product, quantity: 1 }] };
          }
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        })),
      updateQuantity: (productId, amount) =>
        set((state) => ({
          items: state.items.map((item) =>
            item._id === productId ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // name of the item in local storage
    }
  )
);

export default useCartStore;
EOF
echo "✅ Zustand store created."

# 3. Create reusable components
echo "Step 3: Creating reusable components..."

# GlassCard.jsx
cat <<'EOF' > src/components/GlassCard.jsx
import { motion } from 'framer-motion';

const GlassCard = ({
  children,
  className = '',
  hover = true,
  ...rest
}) => {
  const baseClasses =
    'glass-card backdrop-blur-md bg-glass-white border border-white/20 rounded-2xl p-6 shadow-lg shadow-black/20';
  const hoverClasses = hover
    ? 'hover:bg-white/[0.07] hover:border-white/30 transition-all duration-300'
    : '';

  return (
    <motion.div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
EOF

# GlareHover.jsx
cat <<'EOF' > src/components/GlareHover.jsx
/* eslint-disable react/prop-types */
import { useRef } from "react";

const GlareHover = ({
  width = "100%",
  height = "auto",
  background = "transparent",
  borderRadius = "16px",
  borderColor = "rgba(255, 255, 255, 0.3)",
  children,
  glareColor = "#ffffff",
  glareOpacity = 0.5,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
  className = "",
  style = {},
}) => {
  const hex = glareColor.replace("#", "");
  let rgba = glareColor;
  if (/^[\dA-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }

  const overlayRef = useRef(null);

  const animateIn = () => {
    const el = overlayRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.backgroundPosition = "-100% -100%, 0 0";
    requestAnimationFrame(() => {
        el.style.transition = `${transitionDuration}ms ease`;
        el.style.backgroundPosition = "100% 100%, 0 0";
    });
  };

  const animateOut = () => {
    const el = overlayRef.current;
    if (!el) return;
    if (!playOnce) {
        el.style.transition = `${transitionDuration}ms ease`;
        el.style.backgroundPosition = "-100% -100%, 0 0";
    }
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    background: `linear-gradient(${glareAngle}deg, hsla(0,0%,0%,0) 60%, ${rgba} 70%, hsla(0,0%,0%,0) 100%)`,
    backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "-100% -100%, 0 0",
    pointerEvents: "none",
    borderRadius: 'inherit',
  };

  return (
    <div
      className={`relative grid place-items-center overflow-hidden border cursor-pointer ${className}`}
      style={{ width, height, background, borderRadius, borderColor, ...style }}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
    >
      <div ref={overlayRef} style={overlayStyle} />
      {children}
    </div>
  );
};

export default GlareHover;
EOF

# ProductCard.jsx
cat <<'EOF' > src/components/ProductCard.jsx
import { ShoppingCart } from 'lucide-react';
import GlassCard from './GlassCard';
import GlareHover from './GlareHover';
import useCartStore from '../store/cartStore';

const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <GlareHover glareColor="var(--color-cream)">
      <GlassCard className="w-full h-full">
        <div className="flex flex-col items-center text-center h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-40 h-40 object-contain mb-4"
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/160x160/F5F4CC/333?text=Image'; }}
          />
          <h3 className="font-semibold text-lg text-gray-800 h-14 flex-grow">
            {product.name}
          </h3>
          <div className="my-2">
            <p className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
            <div className="flex items-center justify-center text-sm text-gray-500 mt-1">
              <span>⭐ {product.rating}</span>
              <span className="mx-2">|</span>
              <span>({(product.numReviews / 1000).toFixed(0)}k)</span>
            </div>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded-full flex items-center transition-transform transform hover:scale-105"
          >
            <ShoppingCart size={20} className="mr-2" />
            Add to Cart
          </button>
        </div>
      </GlassCard>
    </GlareHover>
  );
};

export default ProductCard;
EOF

# Navbar.jsx
cat <<'EOF' > src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { ShoppingBag } from 'lucide-react';
import useCartStore from '../store/cartStore';

const Navbar = () => {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-seasalt/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-yellow-500">
          SHOPCLUES
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ShoppingBag className="text-gray-700 hover:text-yellow-600"/>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
EOF
echo "✅ Reusable components created."

# 4. Create page components
echo "Step 4: Creating page components..."
# HomePage.jsx
cat <<'EOF' > src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const categories = ["Men", "Women", "Kids", "Old Men"];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // IMPORTANT: Ensure your backend server is running on localhost:5001
        const { data } = await axios.get('http://localhost:5001/api/products');
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Could not load products. Please ensure the backend server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === activeCategory));
    }
  }, [activeCategory, products]);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Hero Section */}
      <div className="bg-seasalt rounded-lg p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center overflow-hidden">
        <div className="md:w-1/2 text-center md:text-left">
          <span className="text-yellow-500 bg-yellow-100 font-semibold px-3 py-1 rounded-full text-sm">WEEKEND DISCOUNT</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mt-4 leading-tight">BEST DEALS<br/>ENDLESS DEALS</h1>
          <p className="mt-4 text-gray-600">Discover the best deals across endless options, offering quality and unbeatable variety daily.</p>
          <button className="mt-6 bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition">Explore Deals</button>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <img src="/images/hero_image.png" alt="Deal" className="w-full max-w-sm h-auto" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/FAFAFA/333?text=Best+Deals'; }} />
        </div>
      </div>

      {/* Products Section */}
      <h2 className="text-3xl font-bold mb-2 text-center md:text-left">CLOTHING</h2>
      <div className="flex justify-center flex-wrap gap-2 mb-8">
        <button onClick={() => setActiveCategory('All')} className={`px-4 py-2 rounded-full font-semibold ${activeCategory === 'All' ? 'bg-gray-800 text-white' : 'bg-seasalt hover:bg-gray-200'}`}>All</button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full font-semibold transition ${activeCategory === cat ? 'bg-gray-800 text-white' : 'bg-seasalt hover:bg-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="text-center">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
EOF

# CartPage.jsx
cat <<'EOF' > src/pages/CartPage.jsx
import useCartStore from '../store/cartStore';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity } = useCartStore();
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-6 py-8 min-h-[calc(100vh-200px)]">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="text-center bg-seasalt p-10 rounded-lg">
          <p className="text-xl text-gray-600">Your cart is empty.</p>
          <Link to="/" className="mt-4 inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-6 rounded-lg">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-seasalt rounded-lg p-4 shadow-sm">
              {items.map((item, index) => (
                <div key={item._id} className={`flex items-center py-4 ${index < items.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-contain rounded-md mr-4" />
                  <div className="flex-grow">
                    <h2 className="font-bold text-lg">{item.name}</h2>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item._id, -1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"><Minus size={16}/></button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"><Plus size={16}/></button>
                  </div>
                  <p className="font-semibold w-24 text-center">${(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700 ml-4">
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/3 bg-seasalt rounded-lg p-6 h-fit shadow-md">
            <h2 className="text-2xl font-bold border-b pb-4">Order Summary</h2>
            <div className="flex justify-between mt-4 font-semibold">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Shipping and taxes calculated at checkout.</p>
            <button className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 rounded-lg">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
EOF
echo "✅ Page components created."

# 5. Update main entry point (main.jsx) and App.jsx
echo "Step 5: Configuring main.jsx and App.jsx..."

# main.jsx
cat <<'EOF' > src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';

// Import your publishable key from the .env file
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env.local file.");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>
);
EOF

# App.jsx
cat <<'EOF' > src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import { SignIn, SignUp } from '@clerk/clerk-react';

// Center Clerk components on the screen
const CenteredClerkForm = ({ children }) => (
    <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        {children}
    </div>
);

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route 
            path="/sign-in/*" 
            element={<CenteredClerkForm><SignIn routing="path" path="/sign-in" /></CenteredClerkForm>} 
          />
          <Route 
            path="/sign-up/*" 
            element={<CenteredClerkForm><SignUp routing="path" path="/sign-up" /></CenteredClerkForm>}
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
EOF
echo "✅ main.jsx and App.jsx configured."
echo ""
echo "🎉 Frontend structure built successfully! 🎉"
echo ""
echo "--------------------------------------------------"
echo "‼️  CRITICAL NEXT STEPS ‼️"
echo "--------------------------------------------------"
echo "1. If you haven't already, add your Clerk Publishable Key to the 'client/.env.local' file."
echo "2. Your backend needs data! In a terminal, send a POST request to seed your database:"
echo "   curl -X POST http://localhost:5001/api/products/seed"
echo ""
echo "--------------------------------------------------"
echo "🚀 HOW TO RUN THE FULL APPLICATION 🚀"
echo "--------------------------------------------------"
echo "1. In one terminal (inside 'pro-shop/server'), run: npm start"
echo "2. In a SECOND terminal (inside 'pro-shop/client'), run: npm run dev"
echo ""
