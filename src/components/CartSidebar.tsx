"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartSidebar() {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, getCartTotal } = useCartStore();
  
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKGROUND BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* SLIDE-OUT DRAWER */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-[100dvh] w-full md:w-[450px] bg-[#FDFBF7] shadow-2xl z-[70] flex flex-col"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-neutral-200">
              <h2 className="text-lg md:text-xl font-serif text-neutral-900">Your Cart</h2>
              <button onClick={closeCart} className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* CART ITEMS LIST */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-neutral-500 space-y-4">
                  <p className="text-xs md:text-sm uppercase tracking-widest font-bold text-center">Your cart is empty.</p>
                  <button onClick={closeCart} className="text-xs border-b border-neutral-900 text-neutral-900 pb-1">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 md:gap-4">
                    {/* Image */}
                    <div className="relative w-20 h-28 md:w-24 md:h-32 bg-[#f4f2ed] rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-contain p-2" unoptimized />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-[11px] md:text-sm font-bold uppercase tracking-wide text-neutral-900 line-clamp-2">{item.title}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-neutral-400 hover:text-red-500 transition-colors shrink-0">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-[10px] md:text-xs text-neutral-500 mt-1">{item.variant.name} Package</p>
                        
                        {/* Display Addons if they exist */}
                        {item.addons.length > 0 && (
                          <div className="mt-1.5 space-y-0.5">
                            {item.addons.map((addon: any, idx: number) => (
                              <p key={idx} className="text-[9px] md:text-[10px] text-neutral-400 uppercase tracking-wider leading-tight">
                                + {addon.name}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Price & Quantity Controls */}
                      <div className="flex justify-between items-end mt-3">
                        <div className="flex items-center gap-3 md:gap-4 border border-neutral-300 rounded-lg px-2.5 py-1 md:px-3 md:py-1.5 bg-white shadow-sm">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-0.5 text-neutral-500 hover:text-neutral-900">
                            <Minus size={14} />
                          </button>
                          <span className="text-[10px] md:text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-0.5 text-neutral-500 hover:text-neutral-900">
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-xs md:text-sm font-medium text-neutral-900">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* FOOTER & CHECKOUT */}
            {cart.length > 0 && (
              <div className="p-4 md:p-6 border-t border-neutral-200 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <span className="text-[10px] md:text-sm uppercase tracking-widest text-neutral-500 font-bold">Subtotal</span>
                  <span className="text-xl md:text-2xl font-serif text-neutral-900">Rs. {getCartTotal().toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-neutral-400 text-center mb-4 md:mb-6 leading-tight">Shipping & taxes calculated at checkout.</p>
                <Link href="/checkout" onClick={closeCart}>
                  <button className="w-full bg-neutral-900 text-[#FDFBF7] py-4 rounded-xl text-[10px] md:text-xs uppercase tracking-widest font-bold hover:bg-neutral-800 transition-all active:scale-[0.98]">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}