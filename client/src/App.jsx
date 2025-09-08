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
