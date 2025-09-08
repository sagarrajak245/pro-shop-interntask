import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Moon, ShoppingBag, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import useCartStore from '../store/cartStore';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-secondary/80 dark:bg-primary/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-yellow-500">
          SHOPCLUES
        </Link>

        {/* --- ICONS REORDERED AS REQUESTED --- */}
        <div className="flex items-center space-x-4">

          {/* 1. Theme Toggle Icon */}
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {theme === 'light' ? <Moon className="text-gray-700 dark:text-gray-300" /> : <Sun className="text-gray-700 dark:text-gray-300" />}
          </button>

          {/* 2. Cart Icon */}
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <ShoppingBag className="text-gray-700 dark:text-gray-300" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* 3. Profile / Sign In Icon */}
          <div className="flex items-center">
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

        </div>
      </nav>
    </header>
  );
};

export default Navbar;
