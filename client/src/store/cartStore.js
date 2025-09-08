import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = 'http://localhost:5001/api/cart';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // OPTIMISTIC: Add item to local state immediately
      addToCart: (product, token) => {
        set((state) => {
          const existingItem = state.items.find((item) => item._id === product._id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        });

        // ASYNC: Sync with backend in the background if the user is logged in
        if (token) {
          axios.post(`${API_URL}/add`, { productId: product._id, quantity: 1 }, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(err => console.error("Sync failed for addToCart:", err));
        }
      },

      // OPTIMISTIC: Remove item from local state
      removeFromCart: (productId, token) => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        }));

        // ASYNC: Sync with backend
        if (token) {
          axios.post(`${API_URL}/remove`, { productId }, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(err => console.error("Sync failed for removeFromCart:", err));
        }
      },

      // OPTIMISTIC: Update quantity in local state
      updateQuantity: (productId, newQuantity, token) => {
        // Prevent non-positive quantities
        const finalQuantity = Math.max(0, newQuantity);

        set((state) => ({
          items: state.items
            .map((item) =>
              item._id === productId ? { ...item, quantity: finalQuantity } : item
            )
            .filter((item) => item.quantity > 0), // Remove item if quantity is 0
        }));

        // ASYNC: Sync with backend
        if (token) {
          axios.post(`${API_URL}/update`, { productId, quantity: finalQuantity }, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(err => console.error("Sync failed for updateQuantity:", err));
        }
      },

      // SYNC cart from backend on login
      syncCart: async (token) => {
        if (!token) return;
        try {
          const { data } = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ items: data }); // Overwrite local cart with the database version
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      },

      // Clear the entire cart locally
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // The key for browser's local storage
    }
  )
);

export default useCartStore;

