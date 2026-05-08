"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useGSAP(() => {
    if (!isMounted) return;

    const hasVisited = sessionStorage.getItem("irtaza_visited");

    if (hasVisited) {
      gsap.set(containerRef.current, { display: "none" });
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(containerRef.current, { display: "none" });
        sessionStorage.setItem("irtaza_visited", "true");
        ScrollTrigger.refresh();
      }
    });

    document.body.style.overflow = "hidden";

    tl.fromTo(textRef.current, 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.5 }
    )
    .to(lineRef.current, { scaleX: 1, duration: 1.5, ease: "power3.inOut" }, "-=0.5") 
    .to(textRef.current, { y: -30, opacity: 0, duration: 0.8, ease: "power3.in", delay: 0.4 }) 
    .to(lineRef.current, { opacity: 0, duration: 0.5 }, "-=0.5") 
    .to(containerRef.current, { 
      yPercent: -100, 
      duration: 1.5, 
      ease: "power4.inOut",
      onStart: () => {
        document.body.style.overflow = "auto";
      }
    });

  }, { scope: containerRef, dependencies: [isMounted] });

  if (!isMounted) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] bg-neutral-900 flex flex-col items-center justify-center text-[#FDFBF7]"
    >
      <div ref={textRef} className="flex flex-col items-center text-center relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-0 md:gap-4 leading-[1.1] mb-6">
          {/* Using viewport width (vw) for perfect mobile scaling, fixed sizes for desktop */}
          <span className="text-[14vw] sm:text-7xl md:text-7xl font-black tracking-tighter italic">IRTAZA</span>
          <span className="text-[14vw] sm:text-7xl md:text-7xl font-light tracking-tighter text-neutral-500">PRINTERS.</span>
        </div>
      </div>

      {/* The Line: 
        On mobile, we place it lower (mt-28) to clear the stacked text.
        On desktop, it sits neatly under the row (mt-24).
      */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] mt-28 md:mt-24 bg-transparent -translate-y-1/2 flex justify-center">
        <div ref={lineRef} className="w-[50vw] md:w-[20vw] h-full bg-[#D4AF37] scale-x-0 origin-center"></div>
      </div>
    </div>
  );
}