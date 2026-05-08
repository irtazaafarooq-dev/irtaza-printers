"use client";

import { useRef, useState } from "react";
import { ArrowRight, Mail, Phone, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ContactPage() {
  const containerRef = useRef<HTMLElement>(null);
  
  // --- Form State ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useGSAP(() => {
    gsap.from(".contact-element", {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.2, 
    });
  }, { scope: containerRef });

  // --- Handle Form Submission ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

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
   <main ref={containerRef} className="relative min-h-screen w-full pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 md:px-12 max-w-[1400px] mx-auto overflow-hidden flex items-start lg:items-center">
      
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        
        {/* --- LEFT COLUMN: Details --- */}
        <div className="flex flex-col justify-center mt-4 lg:mt-0">
          <div className="contact-element flex gap-2 mb-6 md:mb-8 text-neutral-400">
            <span className="block w-1 h-4 bg-neutral-900 transform rotate-12"></span>
            <span className="block w-1 h-4 bg-neutral-900 transform rotate-12"></span>
          </div>
          
          <h1 className="contact-element text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-neutral-900 leading-tight tracking-tight mb-6 md:mb-8">
            Let's discuss
          </h1>
          
          <p className="contact-element text-base md:text-lg text-neutral-600 mb-8 md:mb-12 max-w-md">
            I’d love to hear from you, whether you have a question, a project idea, or just want to connect. Feel free to reach out using the contact form, and I’ll get back to you as soon as possible. Your messages are always valued and appreciated.
          </p>

          <div className="space-y-6 md:space-y-8">
            <div className="contact-element flex items-start gap-4">
              <Mail className="text-neutral-400 mt-1" size={20} strokeWidth={1.5} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1">Email Us</p>
                <a href="mailto:irtazaafarooq@gmail.com" className="text-base md:text-lg font-serif text-neutral-900 hover:opacity-60 transition-opacity break-all">
                  irtazaafarooq@gmail.com
                </a>
              </div>
            </div>

            <div className="contact-element flex items-start gap-4">
              <Phone className="text-neutral-400 mt-1" size={20} strokeWidth={1.5} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1">Call the Studio</p>
                <a href="tel:+923084445261" className="text-base md:text-lg font-serif text-neutral-900 hover:opacity-60 transition-opacity">
                  0308-4445261
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Form --- */}
        <div className="contact-element flex flex-col justify-center">
          <div className="bg-[#FDFBF7] border border-neutral-200 rounded-[2rem] p-6 sm:p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[500px] flex flex-col justify-center">
            
            {isSuccess ? (
              <div className="flex flex-col items-center text-center py-12 animate-in fade-in zoom-in duration-500">
                <CheckCircle2 size={48} strokeWidth={1} className="text-[#D4AF37] mb-6" />
                <h3 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-4">Inquiry Received.</h3>
                <p className="text-sm md:text-base text-neutral-600">
                  Thank you for reaching out. We will review your project details and be in touch with you shortly.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl md:text-2xl font-serif text-neutral-900 mb-6 md:mb-8">Send a Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                  
                  {/* WEB3FORMS ACCESS KEY */}
                  <input type="hidden" name="access_key" value="85352725-01aa-4752-9456-78e4326862a1" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="relative group">
                      <input type="text" name="name" id="name" required className="w-full bg-transparent border-b border-neutral-300 py-2 md:py-3 text-sm text-neutral-900 outline-none focus:border-neutral-900 transition-colors peer" placeholder=" " />
                      <label htmlFor="name" className="absolute left-0 top-2 md:top-3 text-sm text-neutral-400 cursor-text peer-focus:-top-4 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-neutral-900 transition-all peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:tracking-widest">
                        Your Name
                      </label>
                    </div>
                    <div className="relative group">
                      <input type="email" name="email" id="email" required className="w-full bg-transparent border-b border-neutral-300 py-2 md:py-3 text-sm text-neutral-900 outline-none focus:border-neutral-900 transition-colors peer" placeholder=" " />
                      <label htmlFor="email" className="absolute left-0 top-2 md:top-3 text-sm text-neutral-400 cursor-text peer-focus:-top-4 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-neutral-900 transition-all peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:tracking-widest">
                        Email Address
                      </label>
                    </div>
                  </div>

                  <div className="relative group">
                    <input type="text" name="subject" id="subject" required className="w-full bg-transparent border-b border-neutral-300 py-2 md:py-3 text-sm text-neutral-900 outline-none focus:border-neutral-900 transition-colors peer" placeholder=" " />
                    <label htmlFor="subject" className="absolute left-0 top-2 md:top-3 text-sm text-neutral-400 cursor-text peer-focus:-top-4 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-neutral-900 transition-all peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:tracking-widest">
                      Subject / Project Type
                    </label>
                  </div>

                  <div className="relative group pt-2 md:pt-4">
                    <textarea name="message" id="message" required rows={4} className="w-full bg-transparent border-b border-neutral-300 py-2 md:py-3 text-sm text-neutral-900 outline-none focus:border-neutral-900 transition-colors peer resize-none" placeholder=" "></textarea>
                    <label htmlFor="message" className="absolute left-0 top-5 md:top-7 text-sm text-neutral-400 cursor-text peer-focus:-top-1 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-neutral-900 transition-all peer-not-placeholder-shown:-top-1 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:tracking-widest">
                      Tell us about your project...
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-3 w-full bg-neutral-900 text-[#FDFBF7] py-4 mt-2 md:mt-4 uppercase tracking-widest text-xs font-semibold hover:bg-neutral-800 transition-colors duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Submit"} 
                    {!isSubmitting && <ArrowRight size={16} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}