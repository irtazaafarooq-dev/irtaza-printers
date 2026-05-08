"use client";

import { useRef } from "react";
import { PenTool, Ruler, Handshake, Settings, Award } from "lucide-react";
import BackgroundBlob from "@/components/BackgroundBlob";

// 1. IMPORT GSAP
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- CONTENT DATA ---
const reasons = [
  {
    id: 1,
    icon: PenTool,
    title: "Artisan Expertise",
    text: "15 years of experience in printing and unique material mastery, ensuring every detail is perfect.",
  },
  {
    id: 2,
    icon: Ruler,
    title: "Customization",
    text: "Every product is fully personalized to suit your exact vision, custom measurements, and aesthetic requirements.",
  },
  {
    id: 3,
    icon: Handshake,
    title: "Customer-Focused",
    text: "We prioritize a collaborative design process, aiming to exceed your expectations in every single project.",
  },
  {
    id: 4,
    isCustomIcon: true,
    title: "Modern Print Innovation",
    text: "Utilizing advanced materials and techniques, including high-quality linen textures and precision hot stamping.",
  },
  {
    id: 5,
    icon: Settings,
    title: "Flexibility",
    text: "Flexible minimum orders and adaptable design changes to seamlessly meet your evolving needs.",
  },
  {
    id: 6,
    icon: Award,
    title: "Quality Commitment",
    text: "Uncompromising dedication to delivering solutions that meet the highest standards of quality for long-term success.",
  },
];

export default function WhyChooseUs() {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // --- GSAP SCROLL ANIMATIONS ---
  useGSAP(() => {
    
    // 1. Header Animation
    gsap.from(headerRef.current, {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%", 
        // THE FIX: Tells GSAP to reverse the animation when you scroll back up past it!
        toggleActions: "play none none reverse",
      },
    });

    // 2. Cards Animation (Sweeping in)
    const cards = gsap.utils.toArray(".reason-card") as HTMLElement[];

    cards.forEach((card, index) => {
      const isLeftColumn = index % 2 === 0;

      gsap.from(card, {
        x: isLeftColumn ? -100 : 100, 
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.2)", 
        scrollTrigger: {
          trigger: card,
          start: "top 90%", 
          // THE FIX: Applies the same reset logic to every single card
          toggleActions: "play none none reverse",
        },
      });
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full py-16 md:py-40 px-4 sm:px-6 md:px-12 max-w-[1400px] mx-auto z-20 overflow-hidden">
      
      {/* --- HEADER --- */}
      <div ref={headerRef} className="relative z-10 text-center mb-12 md:mb-24 max-w-3xl mx-auto">
        <div className="flex justify-center gap-2 mb-6 text-neutral-400">
          <span className="block w-1 h-4 bg-neutral-300 transform rotate-12"></span>
          <span className="block w-1 h-4 bg-neutral-300 transform rotate-12"></span>
          <span className="block w-1 h-4 bg-neutral-300 transform rotate-12"></span>
          <span className="block w-1 h-4 bg-neutral-300 transform rotate-12"></span>
        </div>
        {/* CHANGED: Smoother typography scaling from 3xl on phone to 6xl on desktop */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-neutral-900 leading-tight tracking-tight mb-4 md:mb-6">
          Why Choose Irtaza Printers for <br className="hidden md:block" /> Your Needs?
        </h2>
        {/* CHANGED: Text sizing for mobile readability */}
        <p className="text-sm sm:text-base md:text-lg text-neutral-600 font-medium max-w-lg mx-auto">
          Explore our uncompromising commitment to artisan craftsmanship and highly tailored design solutions.
        </p>
      </div>

      {/* --- CARDS GRID --- */}
      <div ref={gridRef} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 max-w-5xl mx-auto">
        {reasons.map((reason) => (
          <div 
            key={reason.id} 
            // CHANGED: Reduced padding on mobile (p-8) to save screen space
            className="reason-card relative bg-[#FDFBF7] rounded-[2rem] p-8 sm:p-10 md:p-14 text-center shadow-sm border border-neutral-200 overflow-hidden group transform-gpu transition-shadow duration-500 hover:shadow-xl"
          >
            
            {/* Background Blob */}
            <BackgroundBlob className="!absolute -bottom-[20%] -right-[20%] w-[150%] h-[150%] text-black opacity-20 pointer-events-none z-0 transition-transform duration-700 group-hover:scale-110" />

            <div className="relative z-10 flex flex-col items-center">
              
              {/* ICON RENDERING */}
              <div className="mb-6 md:mb-8 flex items-center justify-center h-14 md:h-16">
                {reason.isCustomIcon ? (
                  <div className="flex gap-3 md:gap-4">
                    {/* CHANGED: Scaled custom icons slightly for mobile (w-14 h-14 on small screens) */}
                    <span className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6900] text-[#FDFBF7] font-serif font-bold text-[10px] md:text-[11px] uppercase tracking-widest shadow-lg leading-tight">
                      Gold<br/>Foil
                    </span>
                    <span className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-xl border-2 border-dashed border-neutral-400 bg-white/50 backdrop-blur-sm text-neutral-800 font-bold text-[10px] md:text-[11px] uppercase tracking-widest">
                      Linen
                    </span>
                  </div>
                ) : (
                  reason.icon && <reason.icon size={40} strokeWidth={1.5} className="text-neutral-900 md:w-[44px] md:h-[44px]" />
                )}
              </div>

              {/* TEXT CONTENT */}
              {/* CHANGED: Mobile heading sizing */}
              <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-neutral-900 mb-3 md:mb-4">
                {reason.title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-neutral-600 leading-relaxed max-w-sm">
                {reason.text}
              </p>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
}