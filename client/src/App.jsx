import { SignIn, SignUp } from '@clerk/clerk-react';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer'; // Import the new Footer
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
          <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
        </Routes>
      </main>
      <Footer /> {/* Add the Footer here */}
    </div>
  );
}

export default App;
