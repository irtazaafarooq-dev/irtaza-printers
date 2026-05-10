"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { X, Plus, Minus, Trash2, Tag, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { validateCouponCode } from "@/lib/actions"; // Adjust path if your actions are elsewhere

export default function CartSidebar() {
  const { 
    cart, isOpen, closeCart, removeFromCart, updateQuantity, getCartTotal,
    coupon, applyCoupon, removeCoupon // <-- NEW ZUSTAND STATES
  } = useCartStore();
  
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false);
  
  // --- NEW: COUPON LOCAL STATE ---
  const [code, setCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  // --- NEW: COUPON HANDLERS ---
  const handleApplyCoupon = async () => {
    if (!code.trim()) return;
    setIsApplying(true);
    setMessage({ text: "", type: "" });

    const result = await validateCouponCode(code);

    if (result.success) {
      applyCoupon({
        code: code.toUpperCase(),
        discountType: result.discountType,
        discountValue: result.discountValue,
      });
      setMessage({ text: "Coupon applied!", type: "success" });
      setCode("");
    } else {
      setMessage({ text: result.message || "Invalid coupon", type: "error" });
    }
    setIsApplying(false);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setMessage({ text: "", type: "" });
  };

  // --- NEW: MATH CALCULATIONS ---
  const subtotal = getCartTotal();
  let discountAmount = 0;
  
  if (coupon) {
    if (coupon.discountType === "percentage") {
      discountAmount = subtotal * (coupon.discountValue / 100);
    } else if (coupon.discountType === "fixed") {
      discountAmount = coupon.discountValue;
    }
  }
  
  // Prevent negative totals
  const finalTotal = Math.max(0, subtotal - discountAmount);

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
                
                {/* --- NEW: COUPON SECTION --- */}
                <div className="mb-6">
                  {coupon ? (
                    <div className="bg-green-50 border border-green-200 p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle2 size={16} />
                        <div>
                          <p className="text-[10px] md:text-xs font-bold">{coupon.code}</p>
                          <p className="text-[9px] md:text-[10px] opacity-80">
                            {coupon.discountType === "percentage" ? `${coupon.discountValue}% off` : `Rs. ${coupon.discountValue} off`}
                          </p>
                        </div>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-green-600 hover:text-green-900 p-1.5 bg-green-100 rounded-lg">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value.toUpperCase())}
                          placeholder="Coupon code"
                          className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none uppercase"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={isApplying || !code}
                          className="bg-neutral-900 text-white font-bold text-[10px] md:text-xs tracking-widest uppercase rounded-lg px-4 hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                          {isApplying ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                        </button>
                      </div>
                      {message.text && (
                        <p className={`text-[10px] flex items-center gap-1 ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                          {message.type === 'error' ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                          {message.text}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* --- TOTALS CALCULATION --- */}
                <div className="space-y-2 mb-4 md:mb-6">
                  <div className="flex justify-between items-center text-neutral-500">
                    <span className="text-[10px] md:text-xs font-medium">Subtotal</span>
                    <span className="text-xs md:text-sm font-medium">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  
                  {coupon && (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="text-[10px] md:text-xs font-medium flex items-center gap-1">
                        <Tag size={12} /> Discount
                      </span>
                      <span className="text-xs md:text-sm font-medium">- Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
                    <span className="text-[10px] md:text-sm uppercase tracking-widest text-neutral-900 font-bold">Total</span>
                    <span className="text-xl md:text-2xl font-serif text-neutral-900">Rs. {finalTotal.toLocaleString()}</span>
                  </div>
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