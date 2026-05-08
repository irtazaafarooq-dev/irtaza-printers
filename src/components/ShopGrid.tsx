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

export default function ShopGrid({ products }: { products: any[] }) {
  return (
   <section className="relative w-full pt-28 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto z-20">
      
      {/* --- TOP HEADER ROW --- */}
      {/* CHANGED: items-start on mobile so it doesn't align weirdly when stacked */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6 md:gap-8 border-b border-neutral-200 pb-10 md:pb-12">
        
        <div className="w-full md:w-1/2 flex flex-col justify-start">
          <div className="flex items-center gap-2 border border-neutral-300 rounded-full px-4 py-2 bg-transparent w-fit mb-4 md:mb-6">
            <span className="w-2 h-2 rounded-full bg-neutral-800"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-800">
              The Complete Archive
            </span>
          </div>
          {/* CHANGED: Smoother text scaling for mobile screens */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-neutral-900 leading-tight">
            Explore Our <br /> Entire Collection.
          </h1>
        </div>

        <div className="w-full md:w-1/2 text-left md:text-right mt-2 md:mt-0">
          {/* CHANGED: Used mr-auto on mobile to keep it left aligned, md:ml-auto for desktop right alignment */}
          <p className="text-neutral-500 max-w-sm mr-auto md:mr-0 md:ml-auto text-sm md:text-base leading-relaxed">
            Every bespoke print, premium packaging, and aesthetic decor piece we have carefully crafted, all in one place.
          </p>
        </div>

      </div>

      {/* --- PRODUCT CARDS --- */}
      {/* CHANGED: Added sm:grid-cols-2 for tablet/large phone support */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
        variants={gridVariants}
        initial="hidden"
        animate="visible" // Notice we use animate instead of whileInView for the top of the page
      >
        {products.map((product) => {
          const displayImage = product.images?.[0] || "/placeholder.png";
          const basePrice = product.basePrice || 0;

          return (
            <Link key={product._id} href={`/product/${product.slug}`} scroll={true}>
              <motion.div 
                variants={cardVariants} 
                className="group relative w-full aspect-[4/5] bg-[#f4f2ed] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500 transform-gpu"
              >
                <BackgroundBlob className="!absolute top-[-10%] left-[-20%] w-[150%] h-[150%] text-black opacity-30 z-0 pointer-events-none" />

                <div className="absolute inset-0 z-10 pb-20">
                  <Image
                    src={displayImage}
                    alt={product.title}
                    fill
                    // CHANGED: Reduced padding slightly on mobile (p-6)
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
                    <p className="text-[10px] md:text-xs text-neutral-500 mt-1 uppercase tracking-wider">
                      FROM {basePrice.toFixed(2)} Rs
                    </p>
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