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
