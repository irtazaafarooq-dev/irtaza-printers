"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { Plus, Minus, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "@studio-freight/react-lenis";
import { useCartStore } from "@/store/cartStore";

export default function AnimatedProductPage({ product }: { product: any }) {
  // --- STATE ---
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || { name: "Standard", price: 0 });
  
  const [selectedAddons, setSelectedAddons] = useState<any[]>(
    product.addons?.length > 0 ? [product.addons[0]] : []
  );
  
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  
  // Controls the main big image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Controls which image the user has explicitly selected to buy!
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); 

  // --- REFS & LENIS ---
  const containerRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const addToCart = useCartStore((state) => state.addToCart);

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [lenis, product.slug]);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(".bg-text", { y: 100, opacity: 0, duration: 1, ease: "power3.out" })
      .from(".center-image", { scale: 0.9, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.6")
      .from(".left-col > *", { x: -30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.6")
      .from(".right-col > *", { x: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.6");
  }, { scope: containerRef });

  // --- HANDLERS ---
  const handleAddToCart = () => {
    setIsAdding(true);

    const addonIds = selectedAddons.map(a => a._id).sort().join('-');
    const imageVariantTag = product.useImageVariants ? `-img${selectedImageIndex}` : '';
    const uniqueCartId = `${product._id}-${selectedVariant._id}-${addonIds}${imageVariantTag}`;

    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);

    const finalAddons = product.useImageVariants 
      ? [...selectedAddons, { name: `Style: Image #${selectedImageIndex + 1}`, price: 0 }]
      : selectedAddons;

    const cartPayload = {
      id: uniqueCartId,
      productId: product._id,
      title: product.title,
      image: product.useImageVariants ? product.images[selectedImageIndex] : (product.images[0] || "/placeholder.png"),
      variant: selectedVariant,
      addons: finalAddons, 
      quantity: quantity,
      price: (product.basePrice || 0) + selectedVariant.price + addonsTotal,
      paymentMethod: product.paymentMethod || "Any",
      customerNote: product.customerNote || ""
    };

    if (typeof window !== "undefined" && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_name: product.title,
        content_ids: [product._id],
        content_type: 'product',
        value: finalPrice,
        currency: 'PKR' 
      });
    }

    addToCart(cartPayload);

    setTimeout(() => {
      setIsAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    }, 800);
  };

  const handleQtyChange = (type: "inc" | "dec") => {
    if (type === "dec" && quantity > 1) setQuantity(q => q - 1);
    if (type === "inc" && quantity < 99) setQuantity(q => q + 1);
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);

  const toggleAddon = (addon: any) => {
    // CHANGED: Strict Radio Behavior - Only ONE can be selected at a time!
    setSelectedAddons([addon]);
  };

  // --- DYNAMIC PRICE CALCULATIONS WITH SALE LOGIC ---
  const basePrice = product.basePrice || 0;
  const comparePrice = product.compareAtPrice || 0; 
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const finalPrice = (basePrice + selectedVariant.price + addonsTotal) * quantity;
  const isSale = comparePrice > basePrice;
  const finalComparePrice = isSale ? ((comparePrice + selectedVariant.price + addonsTotal) * quantity) : 0;

  return (
    <main ref={containerRef} className="relative min-h-screen bg-[#FDFBF7] pt-28 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 md:px-12 overflow-hidden flex items-center">

      <div className="absolute top-20 left-0 w-full text-center z-0 overflow-hidden pointer-events-none select-none">
        <h1 className="bg-text text-[25vw] font-black text-neutral-100 leading-none tracking-tighter">
          {product.bgText}
        </h1>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center mt-4 lg:mt-0">

        {/* --- LEFT COLUMN --- */}
        <div className="left-col lg:col-span-3 flex flex-col order-2 lg:order-1">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-neutral-900 tracking-tight leading-tight mb-2">
            {product.title}
          </h2>
          <p className="text-sm sm:text-base md:text-xl text-neutral-500 uppercase tracking-widest font-bold mb-8 md:mb-12">
            {product.subtitle}
          </p>

          <div className="space-y-4 md:space-y-6">
            {product.features?.map((feature: any, idx: number) => (
              <div key={idx} className="flex flex-col border-l-2 border-neutral-200 pl-4 md:pl-5 py-1">
                <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-900 mb-1">
                  {feature.label}
                </p>
                <p className="text-xs md:text-sm text-neutral-500">
                  {feature.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* --- CENTER COLUMN: IMAGE CAROUSEL --- */}
        <div className="center-image lg:col-span-6 flex justify-center items-center order-1 lg:order-2 relative h-[40vh] sm:h-[50vh] lg:h-[70vh] group">
          <div className="absolute bottom-[10%] w-[60%] h-8 bg-black/20 blur-2xl rounded-[100%] z-0" />

          <div className="relative w-full h-full z-10 scale-110 drop-shadow-2xl flex items-center justify-center">
            {product.images?.map((img: string, idx: number) => (
              <Image 
                key={idx}
                src={img || "/placeholder.png"} 
                alt={`${product.title} - Image ${idx + 1}`}
                fill 
                className={`object-contain object-center transition-opacity duration-500 ${
                  idx === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
                priority={idx === 0} 
                sizes="(max-width: 768px) 100vw, 50vw" 
              />
            ))}
          </div>

          {product.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-0 lg:-left-10 z-20 p-2 md:p-3 bg-white/80 backdrop-blur-sm border border-neutral-200 text-neutral-900 rounded-full shadow-lg opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all hover:scale-110 hover:bg-white"
              >
                <ChevronLeft size={20} className="md:w-6 md:h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-0 lg:-right-10 z-20 p-2 md:p-3 bg-white/80 backdrop-blur-sm border border-neutral-200 text-neutral-900 rounded-full shadow-lg opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all hover:scale-110 hover:bg-white"
              >
                <ChevronRight size={20} className="md:w-6 md:h-6" />
              </button>

              <div className="absolute -bottom-4 md:-bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {product.images.map((_: any, idx: number) => (
                  <div key={idx} className={`h-1.5 md:h-2 rounded-full transition-all ${idx === currentImageIndex ? "bg-neutral-900 w-4 md:w-6" : "bg-neutral-300 w-1.5 md:w-2"}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="right-col lg:col-span-3 flex flex-col justify-center order-3 lg:order-3">

          {/* ======================================================== */}
          {/* DARAZ-STYLE IMAGE SELECTION GRID                         */}
          {/* ======================================================== */}
          {product.useImageVariants && product.images?.length > 0 && (
            <div className="mb-6 md:mb-8">
              <p className="text-[10px] md:text-xs font-bold text-neutral-900 mb-3 md:mb-4 uppercase tracking-widest flex items-center justify-between">
                <span>Select Style</span>
                <span className="text-neutral-500 font-normal">Image {selectedImageIndex + 1} of {product.images.length}</span>
              </p>
              
              <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5 gap-2 max-h-[160px] md:max-h-[220px] overflow-y-auto pr-1 scrollbar-hide">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      setCurrentImageIndex(idx); // Instantly updates the big screen picture!
                    }}
                    className={`relative w-full aspect-[3/4] rounded-md overflow-hidden transition-all duration-200 ${
                      selectedImageIndex === idx 
                        ? "border-2 border-neutral-900 scale-105 shadow-md z-10" 
                        : "border border-neutral-200 bg-white hover:border-neutral-400 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image 
                      src={img} 
                      alt={`Style ${idx + 1}`} 
                      fill 
                      className="object-contain p-1" 
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 1. VARIANTS */}
          {product.variants && product.variants.length > 0 && product.variants[0].name !== "" && (
            <div className="mb-6 md:mb-8">
              <p className="text-[10px] md:text-xs font-bold text-neutral-900 mb-3 md:mb-4 uppercase tracking-widest">Available Packages</p>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((variant: any) => (
                  <button
                    key={variant._id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`flex flex-col items-center justify-center py-2.5 md:py-3 px-2 text-[11px] md:text-sm transition-colors border ${selectedVariant._id === variant._id
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-transparent text-neutral-600 border-neutral-300 hover:border-neutral-500"
                      }`}
                  >
                    <span className="font-medium text-center">{variant.name}</span>
                    {variant.price > 0 && (
                      <span className="text-[9px] md:text-[10px] opacity-70 mt-0.5">+ Rs. {variant.price.toLocaleString()}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. TEXT ADDONS (STRICT RADIO BEHAVIOR) */}
          {product.addons && product.addons.length > 0 && product.addons[0].name !== "" && (
            <div className="mb-6 md:mb-8">
              <p className="text-[10px] md:text-xs font-bold text-neutral-900 mb-3 md:mb-4 uppercase tracking-widest">Select Upgrade</p>
              <div className="space-y-2">
                {product.addons.map((addon: any) => {
                  const isSelected = selectedAddons.some((a) => a._id === addon._id);

                  return (
                    <button
                      key={addon._id}
                      onClick={() => toggleAddon(addon)}
                      className={`w-full flex justify-between items-center py-2.5 md:py-3 px-3 md:px-4 text-[11px] md:text-sm font-medium transition-colors border ${isSelected
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "bg-transparent text-neutral-600 border-neutral-300 hover:border-neutral-500"
                        }`}
                    >
                      <span>{addon.name}</span>
                      
                      {/* CHANGED: Price is hidden if it equals 0 ! */}
                      {addon.price > 0 && (
                        <span className="text-[10px] md:text-xs opacity-90">+ Rs. {addon.price.toLocaleString()}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. DYNAMIC PRICE */}
          <div className="flex flex-col justify-start gap-1 mb-6 md:mb-10 pb-6 md:pb-10 border-b border-neutral-200">
            <p className="text-xs md:text-sm text-neutral-500 mb-1">Total Price</p>
            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
              <p className="text-3xl sm:text-4xl md:text-5xl font-serif text-neutral-900 leading-none">
                Rs. {finalPrice.toLocaleString()}
              </p>
              
              {isSale && (
                <div className="flex items-center gap-2">
                  <p className="text-lg sm:text-xl md:text-2xl font-serif text-neutral-400 line-through leading-none">
                    Rs. {finalComparePrice.toLocaleString()}
                  </p>
                  <span className="bg-red-100 text-red-600 text-[10px] md:text-xs font-bold px-2 py-1 rounded-md tracking-wider">
                    SALE
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CUSTOMER NOTE */}
          {product.customerNote && (
            <div className="mt-4 mb-6 md:mb-8 p-4 bg-[#FDFBF7] border border-neutral-200 rounded-xl">
              <p className="text-xs md:text-sm text-neutral-800 leading-relaxed">
                <span className="font-bold uppercase tracking-wider text-[10px] md:text-xs mr-2 text-neutral-500">Note:</span>
                {product.customerNote}
              </p>
            </div>
          )}

          {/* 4. CHECKOUT ACTIONS */}
          <div className="flex gap-3 md:gap-4 h-12 md:h-14">
            <div className="flex items-center justify-between border border-neutral-300 w-[100px] md:w-1/3 px-2 md:px-4">
              <button onClick={() => handleQtyChange("dec")} className="text-neutral-500 hover:text-neutral-900 p-1"><Minus size={14} className="md:w-4 md:h-4" /></button>
              <span className="text-sm font-bold text-neutral-900">{quantity}</span>
              <button onClick={() => handleQtyChange("inc")} className="text-neutral-500 hover:text-neutral-900 p-1"><Plus size={14} className="md:w-4 md:h-4" /></button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || added}
              className={`flex items-center justify-center gap-2 flex-1 text-[10px] md:text-xs uppercase tracking-widest font-bold transition-all ${added
                  ? "bg-[#D4AF37] text-white"
                  : "bg-neutral-900 text-[#FDFBF7] hover:bg-neutral-800"
                }`}
            >
              {isAdding ? "Adding..." : added ? <><CheckCircle2 size={16} className="w-4 h-4" /> Added</> : "Add to Cart"}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}