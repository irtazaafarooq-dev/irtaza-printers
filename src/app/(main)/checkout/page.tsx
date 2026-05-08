"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Form State - ADDED: Country locked to Pakistan
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Pakistan" 
  });

  // --- SMART PAYMENT LOGIC ---
  const requiresOnline = cart.some((item) => item.paymentMethod === "Online");
  const requiresCOD = cart.some((item) => item.paymentMethod === "COD");
  
  // Determine initial payment selection based on rules
  const defaultPayment = requiresOnline ? "Online" : requiresCOD ? "COD" : "Online";
  const [paymentMethod, setPaymentMethod] = useState(defaultPayment);
  const [paymentProof, setPaymentProof] = useState<string | null>(null);

  useEffect(() => {
    if (requiresOnline) setPaymentMethod("Online");
    else if (requiresCOD) setPaymentMethod("COD");
  }, [requiresOnline, requiresCOD, cart]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // --- DYNAMIC SHIPPING LOGIC ---
  const subtotal = getCartTotal();
  let shipping = 0;
  
  if (subtotal <= 10000) {
    // If order is under 10k, calculate shipping based on payment method
    shipping = paymentMethod === "Online" ? 200 : 275;
  }
  
  const total = subtotal + shipping;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // NEW VALIDATION: Force them to upload a screenshot if paying online!
    if (paymentMethod === "Online" && !paymentProof) {
      alert("Please upload your payment screenshot to proceed.");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      customer: formData,
      items: cart,
      paymentMethod,
      paymentProof, // <-- ADD IT HERE
      subtotal,
      shipping,
      total,
    };

    try {
      // Send the data to our new API endpoint
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Clear cart and show the confirmation screen
        setIsSubmitting(false);
        setOrderSuccess(true);
        clearCart();
        window.scrollTo(0, 0);
      } else {
        throw new Error(data.error || "Failed to place order");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong placing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  // --- SUCCESS STATE ---
  if (orderSuccess) {
    return (
      // CHANGED: Reduced mobile padding
      <main className="min-h-screen bg-[#FDFBF7] pt-28 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-6 md:p-8 rounded-3xl shadow-xl text-center border border-neutral-100"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="md:w-10 md:h-10" />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-2">Order Confirmed!</h1>
          <p className="text-sm md:text-base text-neutral-500 mb-8">
            Thank you for shopping with Irtaza Printers. We are processing your order and will contact you shortly.
          </p>
          <Link href="/shop">
            <button className="w-full bg-neutral-900 text-[#FDFBF7] py-4 rounded-xl text-[10px] md:text-xs uppercase tracking-widest font-bold hover:bg-neutral-800 transition-colors">
              Continue Shopping
            </button>
          </Link>
        </motion.div>
      </main>
    );
  }

  // --- EMPTY CART STATE ---
  if (cart.length === 0) {
    return (
      // CHANGED: Reduced mobile padding
      <main className="min-h-screen bg-[#FDFBF7] pt-28 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4">Your Cart is Empty</h1>
        <Link href="/shop" className="text-sm border-b border-neutral-900 pb-1 font-medium">
          Browse Collection
        </Link>
      </main>
    );
  }

  return (
    // CHANGED: Safe top padding for transparent navbar
    <main className="min-h-screen bg-[#FDFBF7] pt-28 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        
        <Link href="/shop" className="inline-flex items-center text-[10px] md:text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors mb-6 md:mb-8">
          <ChevronLeft size={16} className="mr-1" /> Back to Shop
        </Link>

        {/* CHANGED: Tighter gap on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20">
          
          {/* RIGHT: ORDER SUMMARY (Moved to top on Mobile via order-1!) */}
          <div className="lg:col-span-5 order-1 lg:order-2 relative">
            <div className="lg:sticky top-32 bg-white border border-neutral-200 rounded-[2rem] p-5 md:p-8 shadow-sm">
              <h2 className="text-lg font-serif text-neutral-900 mb-4 md:mb-6">Order Summary</h2>
              
              {/* Items List */}
              <div className="space-y-4 md:space-y-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 md:gap-4">
                    <div className="relative w-14 h-16 md:w-16 md:h-20 bg-[#f4f2ed] rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-contain p-1" unoptimized />
                      <div className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 bg-neutral-900 text-white text-[9px] md:text-[10px] w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full z-10">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[11px] md:text-xs font-bold uppercase text-neutral-900 leading-tight line-clamp-2">{item.title}</h3>
                      <p className="text-[9px] md:text-[10px] text-neutral-500 mt-0.5">{item.variant.name}</p>
                      {item.addons.map((a: any, i: number) => (
                        <p key={i} className="text-[8px] md:text-[9px] text-neutral-400">+ {a.name}</p>
                      ))}
                    </div>
                    <p className="text-[11px] md:text-xs font-bold text-neutral-900 whitespace-nowrap">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-neutral-200 space-y-3 md:space-y-4">
                <div className="flex justify-between text-xs md:text-sm text-neutral-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs md:text-sm text-neutral-600">
                  <span>Shipping <span className="text-[9px] md:text-[10px] ml-1 bg-neutral-100 px-2 py-0.5 rounded-full">{paymentMethod}</span></span>
                  <span>{shipping === 0 ? "Free" : `Rs. ${shipping.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between items-center pt-3 md:pt-4 border-t border-neutral-200">
                  <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-neutral-900">Total</span>
                  <span className="text-xl md:text-2xl font-serif text-neutral-900">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

            </div>
          </div>

          {/* LEFT: CHECKOUT FORM (Moved to bottom on Mobile via order-2!) */}
          <div className="lg:col-span-7 order-2 lg:order-1 mt-4 lg:mt-0">
            <h1 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-6 md:mb-8">Checkout</h1>
            
            <form onSubmit={handlePlaceOrder} className="space-y-8 md:space-y-10">
              
              {/* 1. Contact & Shipping */}
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-neutral-900 mb-3 md:mb-4">Contact & Shipping</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3.5 md:p-4 text-sm md:text-base bg-white border border-neutral-200 rounded-xl outline-none focus:border-neutral-900 transition-colors" />
                  <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3.5 md:p-4 text-sm md:text-base bg-white border border-neutral-200 rounded-xl outline-none focus:border-neutral-900 transition-colors" />
                </div>
                
                <input required type="tel" placeholder="Phone Number (e.g. 0300 1234567)" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3.5 md:p-4 text-sm md:text-base bg-white border border-neutral-200 rounded-xl outline-none focus:border-neutral-900 transition-colors" />
                
                <input required type="text" placeholder="Street Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3.5 md:p-4 text-sm md:text-base bg-white border border-neutral-200 rounded-xl outline-none focus:border-neutral-900 transition-colors" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <input required type="text" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-3.5 md:p-4 text-sm md:text-base bg-white border border-neutral-200 rounded-xl outline-none focus:border-neutral-900 transition-colors" />
                  {/* Read-only Country Field */}
                  <input disabled type="text" value={formData.country} className="w-full p-3.5 md:p-4 text-sm md:text-base bg-neutral-50 border border-neutral-200 rounded-xl outline-none text-neutral-500 cursor-not-allowed" />
                </div>
              </div>

              {/* 2. Payment Method */}
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-neutral-900 mb-3 md:mb-4">Payment Method</h2>
                
                <div className="space-y-3">
                 {/* ONLINE PAYMENT OPTION */}
                  <div 
                    className={`relative p-3.5 md:p-4 rounded-xl border-2 transition-all ${requiresCOD ? 'opacity-50 bg-neutral-100 border-neutral-200' : 'cursor-pointer'} ${paymentMethod === "Online" ? 'border-neutral-900 bg-white' : 'border-neutral-200 bg-transparent'}`}
                  >
                    <div className="flex items-start md:items-center gap-3 md:gap-4" onClick={() => !requiresCOD && setPaymentMethod("Online")}>
                      <div className={`w-4 h-4 md:w-5 md:h-5 mt-0.5 md:mt-0 shrink-0 rounded-full border-2 flex items-center justify-center ${paymentMethod === "Online" ? 'border-neutral-900' : 'border-neutral-300'}`}>
                        {paymentMethod === "Online" && <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-neutral-900 rounded-full" />}
                      </div>
                      <CreditCard size={20} className="text-neutral-700 shrink-0 md:w-6 md:h-6" />
                      <div className="flex-1 w-full">
                        {/* CHANGED: Flex-col on mobile to prevent the badge from squishing the text */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-1 sm:gap-0">
                          <p className="font-bold text-neutral-900 text-xs md:text-sm">Online / Manual Transfer</p>
                          <span className="text-[9px] md:text-[10px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200 w-fit">
                            Rs. 200 Shipping
                          </span>
                        </div>
                        <p className="text-[10px] md:text-xs text-neutral-500 mt-1 md:mt-0">Pay via Bank Transfer, JazzCash, or EasyPaisa.</p>
                      </div>
                    </div>

                    {/* EXPANDED DETAILS (Only shows if Online is selected) */}
                    {paymentMethod === "Online" && (
                      <div className="mt-4 pt-4 border-t border-neutral-200 space-y-4 animate-in fade-in slide-in-from-top-2">
                        
                        {/* Real Bank Details */}
                        <div className="bg-neutral-50 p-3 md:p-4 rounded-lg text-[11px] md:text-xs text-neutral-700 space-y-3 border border-neutral-200">
                          
                          {/* Faysal Bank Info */}
                          <div className="space-y-1">
                            <p className="font-bold text-neutral-900 text-xs md:text-sm uppercase tracking-wider">FAYSAL BANK</p>
                            <p>Account Title: <span className="font-medium">IRTAZA PRINTERS</span></p>
                            <p>Account Number: <span className="font-medium">0186007000002649</span></p>
                            {/* CHANGED: Added break-all to prevent IBAN from breaking layout on small phones */}
                            <p className="break-all">IBAN: <span className="font-medium">PK71FAYS0186007000002649</span></p>
                          </div>

                          <hr className="border-neutral-200" />

                          {/* JazzCash / Easypaisa Info */}
                          <div className="space-y-1">
                            <p className="font-bold text-neutral-900 text-xs md:text-sm uppercase tracking-wider">JazzCash / Easypaisa</p>
                            <p>Account Title: <span className="font-medium">MUHAMMAD IRTAZA FAROOQ</span></p>
                            <p>Number: <span className="font-medium">03218442114</span></p>
                          </div>

                        </div>

                        {/* File Upload Input */}
                        <div>
                          <label className="block text-[10px] md:text-xs font-bold text-neutral-900 mb-2 uppercase tracking-wider">
                            Upload Payment Screenshot *
                          </label>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            // CHANGED: Scaled down file button text for mobile
                            className="block w-full text-xs md:text-sm text-neutral-500 file:mr-3 md:file:mr-4 file:py-1.5 md:file:py-2 file:px-3 md:file:px-4 file:rounded-full file:border-0 file:text-[10px] md:file:text-xs file:font-bold file:bg-neutral-900 file:text-white hover:file:bg-neutral-800 cursor-pointer transition-colors"
                          />
                          {paymentProof && (
                            <p className="text-[10px] md:text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                              ✓ Screenshot attached successfully
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* COD OPTION */}
                  <div 
                    onClick={() => !requiresOnline && setPaymentMethod("COD")}
                    className={`relative p-3.5 md:p-4 rounded-xl border-2 flex items-start md:items-center gap-3 md:gap-4 transition-all ${requiresOnline ? 'opacity-50 bg-neutral-100 cursor-not-allowed border-neutral-200' : 'cursor-pointer'} ${paymentMethod === "COD" ? 'border-neutral-900 bg-white' : 'border-neutral-200 bg-transparent'}`}
                  >
                    <div className={`w-4 h-4 md:w-5 md:h-5 mt-0.5 md:mt-0 shrink-0 rounded-full border-2 flex items-center justify-center ${paymentMethod === "COD" ? 'border-neutral-900' : 'border-neutral-300'}`}>
                      {paymentMethod === "COD" && <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-neutral-900 rounded-full" />}
                    </div>
                    <div className="w-5 h-5 md:w-6 md:h-6 shrink-0 border border-neutral-700 rounded-md flex items-center justify-center mt-0.5 md:mt-0"><span className="text-[8px] md:text-[10px] font-bold">Rs</span></div>
                    <div className="flex-1 w-full">
                      {/* CHANGED: Flex-col on mobile to prevent the badge from squishing the text */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-1 sm:gap-0">
                        <p className="font-bold text-neutral-900 text-xs md:text-sm">Cash on Delivery</p>
                         {/* Dynamic Shipping Badge */}
                         <span className="text-[9px] md:text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 w-fit">
                          Rs. 275 Shipping
                        </span>
                      </div>
                      <p className="text-[10px] md:text-xs text-neutral-500 mt-1 md:mt-0">Pay in cash when your order arrives.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-neutral-900 text-[#FDFBF7] py-4 md:py-5 rounded-xl text-xs md:text-sm uppercase tracking-widest font-bold hover:bg-neutral-800 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center shadow-lg shadow-neutral-900/20"
              >
                {isSubmitting ? "Processing..." : `Place Order • Rs. ${total.toLocaleString()}`}
              </button>

            </form>
          </div>

        </div>
      </div>
    </main>
  );
}