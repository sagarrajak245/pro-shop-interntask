Pro-Shop: A Modern MERN Stack E-Commerce Application
This repository contains the full source code for Pro-Shop, a single-page e-commerce web application built with a modern, professional tech stack. The project features a secure, user-specific shopping cart, a sleek and responsive UI with light/dark modes, and a robust backend deployed on a scalable cloud platform.

# Output:

<img width="1704" height="654" alt="image" src="https://github.com/user-attachments/assets/2b9974ae-65c3-4469-b0c4-ea140627323c" />

<img width="1884" height="873" alt="image" src="https://github.com/user-attachments/assets/ae75675f-8027-436d-9e8e-35b46976a4a0" />



✅ Core Features
This application was built to meet a specific set of requirements, all of which have been successfully implemented:

Backend (Node.js / Express):

[✔] RESTful API for products with filtering capabilities (category, price).

[✔] Secure, token-based authentication using Clerk.

[✔] User-specific cart management with secure CRUD APIs (Add, Get, Update, Remove).

[✔] MongoDB database for persistent storage of products and user data.

Frontend (React / Vite):

[✔] Professional, responsive user interface built with Tailwind CSS.

[✔] Full user authentication with Sign Up and Sign In pages (powered by Clerk).

[✔] Product listing page with dynamic filtering.

[✔] A fully functional, account-based shopping cart page.

[✔] Optimistic UI: Cart updates feel instantaneous to the user while syncing with the backend.

[✔] Light & Dark mode support.

[✔] Modern, custom components like the "Glassmorphism" product cards.

🛠️ Tech Stack
Backend
Runtime: Node.js

Framework: Express.js

Database: MongoDB (with Mongoose for object modeling)

Authentication: Clerk (for user management and JWT session tokens)

Environment: dotenv for managing secret keys

Frontend
Framework: React (with Vite for a fast development environment)

State Management: Zustand (a lightweight, modern state management solution)

Styling: Tailwind CSS

Routing: React Router

Animations: Framer Motion

API Communication: Axios

Deployment
Platform: Render

Services:

Web Service: For hosting the Node.js backend API.

Static Site: For hosting the React frontend application.

🚀 The Project Journey: From Concept to Deployment
This project was built iteratively, evolving from a simple concept to a complex, secure application. This journey involved several key decisions and debugging challenges.

Phase 1: Foundation & Styling
We began by setting up two separate project folders: client and server. The backend was a standard Express server, and the frontend was a Vite-powered React app. We configured Tailwind CSS, adding the custom color palette (cream, seasalt, etc.) and built the foundational UI components you provided: GlassCard and GlareHover.

Phase 2: The Initial "Local" Cart
The first version of the shopping cart was built for speed and simplicity. We used Zustand's persist middleware, which automatically saved the user's cart to the browser's LocalStorage.

What this did: It provided an incredibly fast user experience. Adding items was instant, and the cart persisted even if the user closed the browser.

The limitation: The cart was tied to the browser, not the user's account.

Phase 3: The Pivot to a Secure, User-Specific Cart
To meet the core requirement of an account-based cart, we undertook a major refactor. This was the most complex part of the project.

Backend Expansion:

We created a new userModel in MongoDB to store a clerkId and a nested cart array for each user.

We built a secure /api/cart endpoint protected by a new authMiddleware. This middleware used the Clerk SDK and our CLERK_SECRET_KEY to verify the user's JWT token on every request.

We wrote a cartController with functions to get, add, remove, and update items in the user's specific cart in the database.

Frontend Overhaul:

We removed the persist middleware from Zustand.

The store was rewritten to make API calls to our new backend endpoints. Every cart action (like addToCart) would now send a request to the server.

Phase 4: Debugging & The "Optimistic UI" Solution
This refactor introduced several complex bugs, which we systematically solved:

The Problem: The app felt slow. The UI had to wait for the backend to respond before showing that an item was added to the cart.

The Solution: We implemented an Optimistic UI.

When a user clicks "Add to Cart," the UI updates instantly using the local Zustand store.

Simultaneously, an API call is sent to the backend to save the change.

This provides the speed of the local cart with the persistence of the backend system.

The Problem: The backend was crashing with authentication errors (401 Unauthorized, Invalid JWT).

The Solution: We traced this to a series of subtle bugs:

A race condition on the frontend where we were requesting the cart before Clerk's token was ready. We fixed this using Clerk's useAuth().getToken() hook, which waits for a valid token.

A bug in the backend middleware where we were incorrectly reading the user's ID from the token (userId instead of sub).

A final deployment bug caused by an incorrect ES Module import ({ Clerk } vs. Clerk).

Phase 5: UI Refinements & Deployment
With the core functionality working, we added final touches:

A functional Light/Dark Mode theme switcher.

A modern, responsive Footer.

UI cleanup, such as improving spacing and border visibility on the product cards.

Finally, we deployed the entire application to Render, configuring a Web Service for the backend and a Static Site for the frontend, ensuring all environment variables and rewrite rules were correctly set.

🏃 How to Run Locally
To run this project on your own machine, follow these steps:

Clone the Repository:

git clone <your-repo-url>
cd pro-shop

Setup Backend:

Navigate to the server directory: cd server

Install dependencies: npm install

Create a .env file and add your secret keys:

MONGO_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key

Start the server: npm start (It will run on http://localhost:5001)

Setup Frontend:

In a new terminal, navigate to the client directory: cd client

Install dependencies: npm install

Create a .env.local file and add your Clerk publishable key:

VITE_CLERK_PUBLISHABLE_KEY=your_pk_test_..._key

Start the client: npm run dev (It will run on http://localhost:5173)

Seed the Database:

With the backend running, open a third terminal and run this command to populate the database with sample products:

curl -X POST http://localhost:5001/api/products/seed
