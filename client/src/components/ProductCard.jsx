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
