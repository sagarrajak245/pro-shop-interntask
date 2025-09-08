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
