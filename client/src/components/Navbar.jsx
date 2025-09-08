import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

const Navbar = () => {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-seasalt/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between ">
        <Link to="/" className="text-2xl font-bold text-yellow-500">
          SHOPCLUES
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ShoppingBag className="text-gray-700 hover:text-yellow-600" />
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