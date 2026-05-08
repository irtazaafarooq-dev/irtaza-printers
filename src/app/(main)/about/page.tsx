"use client";

import { useRef } from "react";
import Image from "next/image";
// import BackgroundBlob from "@/components/BackgroundBlob";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef<HTMLElement>(null);
  const imageParallaxRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Initial Page Load Reveal
    gsap.from(".about-hero-text", {
      y: 60,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.2,
    });

    // 2. Parallax Image Effect
    gsap.to(imageParallaxRef.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-container",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // 3. Scroll Reveal for Text Blocks
    const textBlocks = gsap.utils.toArray(".reveal-block") as HTMLElement[];
    textBlocks.forEach((block) => {
      gsap.from(block, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: block,
          start: "top 85%",
        },
      });
    });
  }, { scope: containerRef });

  return (
    // CHANGED: Reduced mobile top/bottom padding slightly for better framing
    <main ref={containerRef} className="relative w-full min-h-screen bg-[#FDFBF7] text-neutral-900 pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      {/* CHANGED: Reduced bottom margin for mobile */}
      <section className="relative px-4 sm:px-6 md:px-12 max-w-[1400px] mx-auto mb-16 md:mb-40">
        <div className="max-w-4xl">
          <div className="about-hero-text flex gap-2 mb-6 md:mb-8 text-neutral-400">
            <span className="block w-1 h-4 bg-neutral-900 transform rotate-12"></span>
            <span className="block w-1 h-4 bg-neutral-900 transform rotate-12"></span>
            <span className="block w-1 h-4 bg-neutral-900 transform rotate-12"></span>
          </div>
          {/* CHANGED: Smoother typography scaling from 5xl on phone to 8xl on desktop */}
          <h1 className="about-hero-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif leading-[1.1] tracking-tight mb-6 md:mb-8">
            The heritage of <br className="hidden md:block" /> tactile design.
          </h1>
          {/* CHANGED: Text sizing and line-height adjusted for mobile readability */}
          <p className="about-hero-text text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl leading-relaxed">
            Irtaza Printers was founded on a singular belief: in an increasingly digital world, the handmade artifact holds more power than ever. We don't just print; we engineer tangible experiences.
          </p>
        </div>
      </section>

      {/* --- CINEMATIC PARALLAX IMAGE --- */}
      {/* CHANGED: Reduced image height on mobile (h-[40vh]) so it's not overwhelmingly tall */}
      <section className="parallax-container relative w-full h-[40vh] md:h-[70vh] overflow-hidden mb-16 md:mb-40 rounded-2xl md:rounded-3xl mx-4 sm:mx-6 md:mx-auto max-w-[calc(100%-2rem)] md:max-w-[1400px]">
        <div 
          ref={imageParallaxRef} 
          className="absolute inset-[-7.5%] w-[115%] h-[115%]"
        >
         <Image 
            src="/image4.png" 
            alt="Irtaza Printers Craftsmanship"
            fill
            className="object-cover object-center"
            priority
            unoptimized={true} 
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </section>

      {/* --- OUR STORY & CRAFT --- */}
      {/* --- OUR STORY & CRAFT --- */}
      {/* THE FIX: Changed mobile to 'block' flow to guarantee no overlap, and kept 'md:grid' for desktop */}
      <section className="px-4 sm:px-6 md:px-12 max-w-[1400px] mx-auto block md:grid md:grid-cols-12 md:gap-8">
        
        {/* Left Column: Sticky Title */}
        {/* CHANGED: Added 'mb-20 md:mb-0' to force a massive gap below this entire section on mobile */}
        <div className="w-full md:col-span-5 relative mb-20 md:mb-0">
          <div className="relative md:sticky md:top-40">
            <h2 className="reveal-block text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight mb-4 md:mb-6">
              Uncompromising <br className="hidden md:block" /> Craftsmanship.
            </h2>
            <div className="reveal-block flex gap-12 mt-8 pt-8 md:mt-12 md:pt-12 border-t border-neutral-200">
              <div>
                <p className="text-3xl md:text-4xl font-serif text-neutral-900 mb-1 md:mb-2">15+</p>
                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">Years Experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Flowing Text */}
        {/* CHANGED: Added 'mt-12 md:mt-0' to push "Our Philosophy" far down on mobile */}
        <div className="w-full md:col-span-7 md:col-start-6 space-y-12 md:space-y-24 mt-12 md:mt-0">
          
          <div className="reveal-block relative">
            <h3 className="relative z-10 text-lg md:text-xl font-bold uppercase tracking-[0.2em] text-neutral-900 mb-4 md:mb-6">Our Philosophy</h3>
            <p className="relative z-10 text-base md:text-lg text-neutral-600 leading-loose">
              Every project begins with a conversation. We believe that true luxury is deeply personal. By limiting our production runs and focusing entirely on Customization, we ensure that every deck of cards, every gilded edge, and every dummy book meets an impossible standard of perfection. 
            </p>
          </div>

          <div className="reveal-block relative">
             <h3 className="relative z-10 text-lg md:text-xl font-bold uppercase tracking-[0.2em] text-neutral-900 mb-4 md:mb-6">The Materials</h3>
            <p className="relative z-10 text-base md:text-lg text-neutral-600 leading-loose">
              Our gold foil is applied using highly calibrated hot-stamping presses, ensuring a debossed texture you can feel with your fingertips. It is a harmonious blend of old-world artisan techniques and modern precision engineering.
            </p>
          </div>

        </div>

      </section>
      
    </main>
  );
}