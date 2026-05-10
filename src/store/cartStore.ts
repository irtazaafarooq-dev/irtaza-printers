import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Define what a Cart Item looks like
export interface CartItem {
  id: string; // A unique ID we generate (Product ID + Variant ID)
  productId: string;
  title: string;
  image: string;
  variant: any;
  addons: any[];
  quantity: number;
  price: number;
  paymentMethod: string; // The price for ONE of these (Base + Variant + Addons)
}

// NEW: Define what a Coupon looks like to keep TypeScript happy
export interface CouponState {
  code: string;
  discountType: string;
  discountValue: number;
}

// 2. Define what the Store can do
interface CartState {
  cart: CartItem[];
  isOpen: boolean; 
  coupon: CouponState | null; // <-- NEW
  openCart: () => void; 
  closeCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  applyCoupon: (couponData: CouponState) => void; // <-- NEW
  removeCoupon: () => void; // <-- NEW
}

// 3. Create the actual Store
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isOpen: false, 
      coupon: null, // <-- NEW: Starts with no coupon

      openCart: () => set({ isOpen: true }), 
      closeCart: () => set({ isOpen: false }),

      // --- NEW: COUPON ACTIONS ---
      applyCoupon: (couponData) => set({ coupon: couponData }),
      removeCoupon: () => set({ coupon: null }),

      // ADD TO CART
      addToCart: (item) => set((state) => {
        // Check if this EXACT item (same variant and addons) is already in the cart
        const existingItemIndex = state.cart.findIndex((cartItem) => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
          // If it exists, just increase the quantity
          const updatedCart = [...state.cart];
          updatedCart[existingItemIndex].quantity += item.quantity;
          return { cart: updatedCart };
        } else {
          // If it's new, add it to the end of the array
          return { cart: [...state.cart, item] };
        }
      }),

      // REMOVE FROM CART
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id)
      })),

      // UPDATE QUANTITY
      updateQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map((item) => 
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),

      // CLEAR CART (Used after successful checkout)
      clearCart: () => set({ 
        cart: [], 
        coupon: null // <-- CHANGED: Also clear the coupon when order is finished!
      }),

      // GET TOTAL PRICE (Helper function for the checkout page)
      // NOTE: This gets the raw total. We will calculate the discount on the Cart page!
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'irtaza-cart-storage', // This is the name it saves as in LocalStorage!
    }
  )
);