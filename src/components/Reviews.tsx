"use client";

import { useState, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 1. IMPORT GSAP
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- DUMMY REVIEW DATA ---
const reviews = [
  {
    id: 1,
    quote: "These aren't just playing cards; they are functional pieces of art, the quality is too good.",
    name: "Arrobah T.24",
    product: "Golder Playing Cards",
  },
  {
    id: 2,
    quote: "Material Quality: Good.",
    name: "Bakhtawar",
    product: "Dummy Books",
  },
  {
    id: 3,
    quote: "The cards are stunning, the design is unique and the quality is top-notch.",
    name: "Qasim",
    product: "Custom Playing Cards",
  },
   {
    id: 4,
    quote: "These books are hollow inside and are perfect for storing my secret treasures. The craftsmanship is impressive.",
    name: "Wajheen Zahra",
    product: "Dummy Books",
  },
    {
    id: 5,
    quote: "Yeh cards ki quality bht behtreen hai or price bhi reasonable hai.",
    name: "Mr. Usman",
    product: "Golden Playing Cards",
  },
];

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  // --- GSAP SCROLL REVEAL ---
  useGSAP(() => {
    gsap.from(containerRef.current, {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  }, { scope: containerRef });

  // --- NAVIGATION CONTROLS ---
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  return (
    <section ref={containerRef} className="relative w-full py-20 md:py-48 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto z-20 overflow-hidden">
      
      {/* Giant Decorative Quote Mark Background */}
      {/* CHANGED: Increased mobile size to 60vw to act as a proper watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[60vw] md:text-[25vw] font-serif font-black text-neutral-900 opacity-[0.02] pointer-events-none select-none leading-none z-0">
        &rdquo;
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* Subtitle */}
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-8 md:mb-12">
          Client Testimonials
        </p>

        {/* --- DYNAMIC REVIEW CONTENT --- */}
        {/* AnimatePresence allows elements to animate OUT before the new one animates IN */}
        {/* CHANGED: Increased mobile min-h to 300px to accommodate text wrapping on narrow screens */}
        <div className="min-h-[300px] md:min-h-[200px] flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // Elegant custom ease
              className="flex flex-col items-center"
            >
              
              {/* 5 Gold Stars */}
              <div className="flex gap-1.5 mb-6 md:mb-8">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* The Quote */}
              {/* CHANGED: Smoother typography scaling from text-xl on phone to text-5xl on desktop */}
              <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-serif text-neutral-900 leading-relaxed md:leading-tight tracking-tight mb-8 md:mb-10 max-w-4xl px-2">
                "{reviews[currentIndex].quote}"
              </h3>

              {/* Client Info */}
              <div className="flex flex-col items-center gap-1 md:gap-2">
                <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-neutral-900 uppercase">
                  {reviews[currentIndex].name}
                </p>
                <p className="text-xs md:text-sm text-neutral-500 italic font-serif">
                  {reviews[currentIndex].product}
                </p>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- NAVIGATION ARROWS --- */}
        {/* CHANGED: Reduced margin-top on mobile to save space */}
        <div className="flex gap-4 md:gap-6 mt-8 md:mt-16">
          <button 
            onClick={handlePrev}
            className="p-3 md:p-4 rounded-full border border-neutral-200 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 transition-all duration-300"
          >
            <ArrowLeft size={18} strokeWidth={1} className="md:w-5 md:h-5" />
          </button>
          <button 
            onClick={handleNext}
            className="p-3 md:p-4 rounded-full border border-neutral-200 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 transition-all duration-300"
          >
            <ArrowRight size={18} strokeWidth={1} className="md:w-5 md:h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}