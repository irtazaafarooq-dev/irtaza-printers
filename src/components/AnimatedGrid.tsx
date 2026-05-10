"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ShoppingCart } from "lucide-react"; 
import BackgroundBlob from "@/components/BackgroundBlob"; 

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 15 },
  },
};

// We now accept the live products from the server!
export default function AnimatedGrid({ products }: { products: any[] }) {
  return (
    <section className="relative w-full py-16 md:py-32 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto z-20">
      
      {/* --- TOP HEADER ROW --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16 gap-6 md:gap-8">
        <div className="w-full md:w-1/3 flex justify-center md:justify-start">
          <div className="flex items-center gap-2 border border-neutral-300 rounded-full px-4 py-2 bg-transparent">
            <span className="w-2 h-2 rounded-full bg-neutral-800"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-800">
              Best Selling Products
            </span>
          </div>
        </div>
        <div className="w-full md:w-1/3 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-neutral-900 leading-tight">
            Products That <br className="hidden md:block" /> Elevate Your Space
          </h2>
        </div>
        <div className="hidden md:block w-full md:w-1/3"></div>
      </div>

      {/* --- PRODUCT CARDS --- */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {products.map((product) => {
          // Grab image and prices
          const displayImage = product.images?.[0] || "/placeholder.png";
          const basePrice = product.basePrice || 0;
          const comparePrice = product.compareAtPrice || 0;
          
          // Check if this product is actively on sale
          const isSale = comparePrice > basePrice;

          return (
            <Link key={product._id} href={`/product/${product.slug}`} >
              <motion.div 
                variants={cardVariants} 
                className="group relative w-full aspect-[4/5] bg-[#f4f2ed] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500 transform-gpu"
              >
                {/* --- NEW: FLOATING SALE BADGE --- */}
                {isSale && (
                  <div className="absolute top-4 right-4 z-30 bg-red-600 text-white text-[9px] md:text-[10px] font-bold px-3 py-1.5 rounded-full tracking-widest uppercase shadow-md">
                    Sale
                  </div>
                )}

                <BackgroundBlob className="!absolute top-[-10%] left-[-20%] w-[150%] h-[150%] text-black opacity-30 z-0 pointer-events-none" />

                <div className="absolute inset-0 z-10 pb-20">
                  <Image
                    src={displayImage}
                    alt={product.title}
                    fill
                    className="object-contain object-center p-6 md:p-8 transition-transform duration-700 ease-out group-hover:scale-105"
                    unoptimized 
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none z-10" />

                <div className="absolute bottom-4 left-4 right-4 bg-[#FDFBF7] rounded-2xl p-4 flex justify-between items-center translate-y-1 group-hover:translate-y-0 transition-transform duration-500 shadow-md z-20">
                  <div className="flex flex-col">
                    <h3 className="text-xs md:text-sm font-bold uppercase tracking-wide text-neutral-900 line-clamp-1">
                      {product.title}
                    </h3>
                    
                    {/* --- CHANGED: DYNAMIC PRICE DISPLAY --- */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <p className="text-[10px] md:text-xs text-neutral-900 font-bold uppercase tracking-wider">
                        FROM Rs. {basePrice.toLocaleString()}
                      </p>
                      {isSale && (
                        <p className="text-[9px] md:text-[10px] text-neutral-400 line-through">
                          Rs. {comparePrice.toLocaleString()}
                        </p>
                      )}
                    </div>

                  </div>
                  <button className="bg-neutral-100 p-2 md:p-3 rounded-xl text-neutral-900 group-hover:bg-neutral-900 group-hover:text-[#FDFBF7] transition-colors duration-300 shrink-0">
                    <ShoppingCart size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>
    </section>
  );
}