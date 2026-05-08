"use client";

import { ShoppingBag, User, Menu, X } from "lucide-react"; // ADDED: Menu and X icons
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion"; // ADDED: AnimatePresence for smooth mobile menu
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

// --- 1. NAVBAR ANIMATION RULES ---
const navContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    // Very fast stagger so the navbar loads quickly!
    transition: { staggerChildren: 0.02, delayChildren: 0.1 },
  },
};

const navCharVariants: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: { type: "spring", damping: 15, stiffness: 150 },
  },
};

// --- 2. REUSABLE SPLIT TEXT COMPONENT ---
const SplitText = ({ children, className = "" }: { children: string; className?: string }) => {
  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={navContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {children.split(" ").map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              variants={navCharVariants}
              className="inline-block will-change-transform"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
};

// --- 3. MAIN NAVBAR COMPONENT ---
export default function Navbar() {

  const { cart, openCart } = useCartStore();

  // Hydration fix & Mobile Menu State
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // NEW: Controls the mobile drawer

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // NEW: Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  // Calculate total items (e.g., 2 cards + 1 book = 3 items)
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="fixed top-0 w-full z-50 py-6 bg-transparent pointer-events-none">

      {/* Added relative positioning to keep the absolute logo centered perfectly */}
      <nav className="w-full flex justify-between items-center px-6 md:px-12 max-w-[1600px] mx-auto pointer-events-auto relative">

        {/* LEFT SIDE: Mobile Hamburger (Visible ONLY on phones) */}
        <div className="flex md:hidden w-1/3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="text-neutral-900 hover:opacity-70 transition-opacity"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* LEFT SIDE: Desktop Links (Visible ONLY on md and up) */}
        <div className="hidden md:flex w-1/3 gap-10 items-center text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-900">
          <Link href="/" className="relative group overflow-hidden">
            <SplitText>HOME</SplitText>
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900 -translate-x-[105%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
          </Link>
          <Link href="/shop" className="relative group overflow-hidden">
            <SplitText>SHOP</SplitText>
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900 -translate-x-[105%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
          </Link>
          <Link href="/contact-page" className="relative group overflow-hidden">
            <SplitText>CONTACT</SplitText>
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900 -translate-x-[105%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
          </Link>
          <Link href="/about" className="relative group overflow-hidden">
            <SplitText>ABOUT</SplitText>
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900 -translate-x-[105%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
          </Link>
        </div>

        {/* CENTER: Logo (Absolute positioning so it stays dead center) */}
        <div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
          <Link href="/" className="flex items-baseline text-xl md:text-2xl tracking-tighter text-neutral-900">
            <span className="font-black italic">
              <SplitText>IRTAZA</SplitText>
            </span>
            <span className="font-light not-italic text-neutral-500 ml-1">
              <SplitText>PRINTERS</SplitText>
            </span>
          </Link>
        </div>

        {/* RIGHT: Icons (Added w-1/3 and justify-end to balance the flexbox layout) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex gap-6 items-center justify-end w-1/3 text-neutral-900"
        >
          <div className="relative cursor-pointer hover:text-neutral-500 transition-colors" onClick={openCart}>
            <ShoppingBag size={24} strokeWidth={1.5} />

            {/* ONLY render the badge if the component is mounted AND there are items */}
            {isMounted && totalItems > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center pointer-events-none">
                {totalItems}
              </div>
            )}
          </div>
        </motion.div>

      </nav>

      {/* --- NEW: MOBILE FULL-SCREEN MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[100] bg-[#FDFBF7] flex flex-col items-center justify-center pointer-events-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-neutral-900 hover:rotate-90 transition-transform duration-300"
            >
              <X size={32} strokeWidth={1.5} />
            </button>

            {/* Huge, elegant links for mobile */}
            <div className="flex flex-col items-center gap-8 text-3xl font-serif tracking-widest text-neutral-900 uppercase">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-neutral-500 transition-colors">Home</Link>
              <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-neutral-500 transition-colors">Shop</Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-neutral-500 transition-colors">Contact</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-neutral-500 transition-colors">About</Link>
            </div>
            
            {/* Small subtle branding at the bottom of the menu */}
            <div className="absolute bottom-12 text-xs font-bold tracking-[0.3em] text-neutral-400 uppercase">
              Irtaza Printers
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}