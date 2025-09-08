import axios from 'axios';
import { useEffect, useState } from 'react';
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
      <div className="bg-cream rounded-lg p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center overflow-hidden">
        <div className="md:w-1/2 text-center md:text-left">
          <span className="text-amber-500 bg-yellow-200 font-semibold px-3 py-1 rounded-full text-sm">WEEKEND DISCOUNT</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mt-4 leading-tight">BEST DEALS<br />ENDLESS DEALS</h1>
          <p className="mt-4 text-gray-600">Discover the best deals across endless options, offering quality and unbeatable variety daily.</p>
          <button className="mt-6 bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition">Explore Deals</button>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <img src="https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Deal" className="w-full max-w-sm h-auto" onError={(e) => { e.target.onerror = null; e.target.src = ''; }} />
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
