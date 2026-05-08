"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

// 1. IMPORT GSAP & SCROLLTRIGGER
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- FRAMER MOTION RULES ---
const helloContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 1.5, staggerChildren: 0.1 }, 
  },
};

const helloLetterVariants: Variants = {
  hidden: { opacity: 0, y: 120, filter: "blur(12px)" }, 
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {duration: 1.8, ease: [0.16, 1, 0.3, 1] }, 
  },
};

const splitTextContainer: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.02 } },
};

const splitCharVariants: Variants = {
  hidden: { y: "100%" }, 
  visible: { y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
};

const SplitText = ({ children, className = "", isReady }: { children: string, className?: string, isReady?: boolean }) => {
  return (
    <motion.span 
      className={`inline-flex flex-wrap justify-center md:justify-start ${className}`}
      variants={splitTextContainer}
      initial="hidden"
      animate={isReady ? "visible" : "hidden"}
    >
      {children.split(' ').map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
          {word.split('').map((char, charIndex) => (
            <motion.span key={charIndex} variants={splitCharVariants} className="inline-block will-change-transform">
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
};

// WE NOW ACCEPT THE BEST SELLERS FROM THE DATABASE
export default function Hero({ bestSellers = [] }: { bestSellers?: any[] }) {
  // Fallback in case your database is empty
  const displayProducts = bestSellers.length > 0 ? bestSellers : [
    {
      title: "Cards & Decor Books.",
      subtitle: "Premium customized playing cards and aesthetic dummy books designed to elevate your space.",
      images: ["/placeholder.png"],
      features: [{ label: "Featured Material", value: "310gsm Linen & Gold Foil" }],
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Get the current active product
  const currentProduct = displayProducts[currentIndex];

  // --- GSAP REFS ---
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("irtaza_visited");
    if (hasVisited) {
      setIsReady(true);
    } else {
      const timer = setTimeout(() => setIsReady(true), 4500);
      return () => clearTimeout(timer);
    }
  }, []);

  // --- GSAP PARALLAX LOGIC (NOW DESKTOP ONLY) ---
  useGSAP(() => {
    // We use matchMedia to ensure parallax ONLY happens on desktop screens (768px and up)
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.to(textRef.current, {
        yPercent: 40, 
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top", 
          end: "bottom top", 
          scrub: true, 
        },
      });

      gsap.to(imageRef.current, {
        yPercent: -20, 
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => mm.revert(); // Clean up on unmount
  }, { scope: containerRef }); 

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % displayProducts.length);
  const handlePrev = () => setCurrentIndex((prev) => prev === 0 ? displayProducts.length - 1 : prev - 1);

  const letters = "HELLO".split("");

  return (
    <main ref={containerRef} className="relative min-h-[100dvh] md:h-screen w-full overflow-x-clip font-sans flex flex-col justify-center md:justify-end pt-24 pb-12 md:pt-0 md:pb-12">      
      
      {/* Background Typography */}
      <div ref={textRef} className="hidden md:flex absolute inset-0 items-start justify-center pt-[15vh] select-none pointer-events-none z-0">
        <motion.h1 
          className="flex text-[24vw] font-black text-transparent [-webkit-text-stroke:3px_#171717] leading-none tracking-tighter opacity-90 uppercase"
          variants={helloContainerVariants}
          initial="hidden"
          animate={isReady ? "visible" : "hidden"}
        >
          {letters.map((letter, index) => (
            <motion.span key={index} variants={helloLetterVariants}>{letter}</motion.span>
          ))}
        </motion.h1>
      </div>

      {/* Foreground Container */}
      {/* CHANGED: Reduced gap-6 to gap-2 on mobile to pull sections closer together */}
      <div className="w-full relative z-20 container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-2 md:gap-0 h-full md:h-auto">
        
        {/* Left Side: Hook (ORDER 1 ON MOBILE) */}
        {/* CHANGED: Reduced space-y-5 to space-y-3 on mobile */}
        <div className="order-1 md:order-none space-y-3 md:space-y-8 flex flex-col items-center text-center md:items-start md:text-left w-full md:w-1/3">
          <div className="space-y-2 md:space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-neutral-900 tracking-tight drop-shadow-sm">
              <SplitText key={`title-${currentIndex}`} isReady={isReady}>{currentProduct.title}</SplitText>
            </h2>
            <p className="text-sm sm:text-base md:text-lg max-w-xs md:max-w-sm font-medium text-neutral-600">
              <SplitText key={`sub-${currentIndex}`} isReady={isReady}>{currentProduct.subtitle}</SplitText>
            </p>
          </div>
          
          <Link href="/shop" className="pointer-events-auto w-full sm:w-auto">
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.8 }}
              className=" hidden md:block w-full sm:w-auto border-2 border-neutral-900 text-neutral-900 px-8 py-3.5 md:py-3 uppercase tracking-widest text-xs font-semibold hover:bg-neutral-900 hover:text-[#FDFBF7] transition-all duration-300 bg-[#FDFBF7]/70 md:bg-[#FDFBF7]/60 backdrop-blur-sm"
            >
              Shop Collection
            </motion.button>
          </Link>
        </div>

        {/* Product Image & Shadows (ORDER 2 ON MOBILE) */}
        {/* CHANGED: Slightly reduced height on mobile (h-[40vh]) so everything fits perfectly together */}
        <div ref={imageRef} className="order-2 md:order-none relative md:absolute md:bottom-[-80px] md:left-1/2 md:-translate-x-1/2 w-full max-w-[320px] sm:max-w-[320px] md:max-w-2xl h-[40vh] sm:h-[40vh] md:h-[70vh] z-10 pointer-events-none flex items-center md:items-end justify-center my-0 md:m-0">
          
          {/* ======================================================= */}
          {/* NEW: MOBILE ONLY ARROWS ON SIDES OF IMAGE                 */}
          {/* ======================================================= */}
          <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            onClick={handlePrev}
            className="md:hidden absolute left-[-10px] top-1/2 -translate-y-1/2 z-30 pointer-events-auto p-2.5 border border-neutral-300 text-neutral-900 bg-[#FDFBF7]/80 backdrop-blur-md hover:bg-neutral-900 hover:text-[#FDFBF7] transition-all"
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
          </motion.button>

          <motion.div 
            key={`img-${currentIndex}`} 
            initial={{ opacity: 0 }}
            animate={isReady ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="w-full h-full relative flex items-center md:items-end justify-center"
          >
            {/* Shadows */}
            <div className="absolute bottom-[20px] md:bottom-[100px] w-[80%] md:w-[50%] h-4 md:h-8 bg-black/15 md:bg-black/25 blur-xl md:blur-3xl rounded-[100%] z-0 translate-x-0 md:translate-x-16" />
            <div className="flex justify-center md:justify-start relative w-full h-full scale-100 md:scale-110 origin-bottom z-10 drop-shadow-[20px_40px_10px_rgba(0,0,0,0.2)] md:drop-shadow-[100px_200px_20px_rgba(0,0,0,0.4)] transition-all duration-500">
                <Image
                  src={currentProduct.images[0] || "/placeholder.png"}
                  alt={currentProduct.title}
                  fill
                  className="object-contain object-center md:object-bottom" 
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
          </motion.div>

          <motion.button 
            initial={{ opacity: 0, x: 10 }}
            animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
            onClick={handleNext}
            className="md:hidden absolute right-[-10px] top-1/2 -translate-y-1/2 z-30 pointer-events-auto p-2.5 border border-neutral-300 text-neutral-900 bg-[#FDFBF7]/80 backdrop-blur-md hover:bg-neutral-900 hover:text-[#FDFBF7] transition-all"
          >
            <ArrowRight size={18} strokeWidth={1.5} />
          </motion.button>
          {/* ======================================================= */}
        </div>

        {/* Right Side: Details (ORDER 3 ON MOBILE) */}
        {/* CHANGED: Reduced space-y-6 to space-y-2 on mobile */}
        <div className="order-3 md:order-none flex flex-col items-center md:items-end text-center md:text-right space-y-2 md:space-y-12 w-full md:w-1/3">
          <div className="space-y-1 md:space-y-2">
            <p className="text-[10px] md:text-xs tracking-[0.2em] font-bold uppercase text-neutral-400">
              <SplitText key={`feat-label-${currentIndex}`} isReady={isReady}>
                {currentProduct.features?.[0]?.label || "Featured Material"}
              </SplitText>
            </p>
            <p className="text-xl md:text-2xl font-serif text-neutral-900 drop-shadow-sm max-w-[250px]">
              <SplitText key={`feat-val-${currentIndex}`} isReady={isReady}>
                {currentProduct.features?.[0]?.value || "Premium Quality"}
              </SplitText>
            </p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={isReady ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-2 justify-center md:justify-end pt-3 md:pt-4"
            >
              {displayProducts.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`block h-1 transition-all duration-300 ${currentIndex === idx ? 'w-8 bg-neutral-900' : 'w-2 bg-neutral-300'}`}
                ></span>
              ))}
            </motion.div>
          </div>

          {/* CHANGED: Added hidden md:flex here so these bottom arrows ONLY show on desktop now */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.9 }}
            className="hidden md:flex space-x-4 pointer-events-auto justify-end w-full"
          >
            <button 
              onClick={handlePrev}
              className="p-3 md:p-4 border border-neutral-300 text-neutral-900 hover:border-neutral-900 transition-colors bg-[#FDFBF7]/70 md:bg-[#FDFBF7]/60 backdrop-blur-sm"
            >
              <ArrowLeft size={20} strokeWidth={1.5} />
            </button>
            <button 
              onClick={handleNext}
              className="p-3 md:p-4 border border-neutral-300 text-neutral-900 hover:border-neutral-900 transition-colors bg-[#FDFBF7]/70 md:bg-[#FDFBF7]/60 backdrop-blur-sm"
            >
              <ArrowRight size={20} strokeWidth={1.5} />
            </button>
          </motion.div>
        </div>

      </div>
    </main>
  );
}