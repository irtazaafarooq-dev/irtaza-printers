"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react"; 

export default function SiteFooter() {
  // --- State for Newsletter Submission ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Handle Newsletter Submit ---
  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("subject", "New Newsletter Subscription!");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative w-full bg-neutral-900 text-[#FDFBF7] pt-16 md:pt-32 pb-8 px-4 sm:px-6 md:px-12 overflow-hidden z-20">
      <div className="max-w-[1600px] mx-auto">
        
        {/* --- TOP SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-16 md:mb-24">
          
          <div className="md:col-span-5 flex flex-col justify-center">
            <h3 className="text-3xl md:text-4xl font-serif mb-4 text-center md:text-left">
              Join the Archive.
            </h3>
            <p className="text-neutral-400 mb-8 max-w-sm mx-auto md:mx-0 text-sm md:text-base leading-relaxed text-center md:text-left">
              Subscribe to receive exclusive access to limited drops and editorial print content.
            </p>
            
            {isSuccess ? (
              <div className="flex items-center justify-center md:justify-start gap-3 text-[#D4AF37] border-b border-neutral-800 pb-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CheckCircle2 size={20} strokeWidth={1.5} />
                <span className="text-sm font-medium tracking-wide">Subscription Confirmed.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-end gap-4 border-b border-neutral-600 pb-3 focus-within:border-[#FDFBF7] transition-colors duration-300">
                <input type="hidden" name="access_key" value="85352725-01aa-4752-9456-78e4326862a1" />
                <input 
                  type="email" 
                  name="email"
                  required
                  aria-label="Email address"
                  placeholder="Enter your email address" 
                  className="w-full bg-transparent outline-none text-sm placeholder:text-neutral-500 disabled:opacity-50 py-2"
                  disabled={isSubmitting}
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="text-neutral-400 hover:text-[#FDFBF7] transition-colors pb-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="text-xs uppercase tracking-widest animate-pulse">Wait...</span>
                  ) : (
                    <ArrowRight size={20} strokeWidth={1.5} />
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="hidden md:block md:col-span-2"></div>

          {/* Links Grid */}
          <div className="md:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-6">Navigation</p>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/shop" className="hover:text-neutral-400 transition-colors">Shop Collection</Link></li>
                <li><Link href="/about" className="hover:text-neutral-400 transition-colors">Our Story</Link></li>
                <li><Link href="/contact-page" className="hover:text-neutral-400 transition-colors">Contact Us</Link></li>
                <li><Link href="/blog" className="hover:text-neutral-400 transition-colors">Blogs</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-6">Socials</p>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="https://www.instagram.com/irtazaprinters/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- MIDDLE SECTION: Giant Typography --- */}
        <div className="w-full border-t border-neutral-800 pt-12 pb-12 md:pb-24 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-0 md:gap-8 select-none group">
            <div className="text-[22vw] md:text-[12vw] leading-none font-black tracking-tighter italic text-[#FDFBF7] hover:scale-[1.02] transition-transform duration-700 cursor-default">
              IRTAZA
            </div>
            <div className="text-[22vw] md:text-[12vw] leading-none font-light tracking-tighter text-neutral-500 group-hover:text-neutral-400 transition-colors duration-700 cursor-default">
              PRINTERS
            </div>
        </div>

        {/* --- BOTTOM SECTION: Copyright & Legal --- */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-neutral-500 gap-6 text-center md:text-left border-t border-neutral-800 md:border-none pt-8 md:pt-0">
          <p>© {new Date().getFullYear()} Irtaza Printers. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/privacy-policy" className="hover:text-[#FDFBF7] transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-[#FDFBF7] transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}