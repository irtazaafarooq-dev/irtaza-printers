import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import BackgroundBlob from "@/components/BackgroundBlob"; 
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import CartSidebar from "@/components/CartSidebar";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Suspense } from "react";
import FacebookPixel from "@/components/FacebookPixel";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll>
        
        {/* BLOB 1: Top Right */}
        <BackgroundBlob className="top-0 right-0 w-[5vw] md:w-[80vw] h-[5vw] md:h-[80vw] translate-x-[40%] -translate-y-[40%] text-black opacity-50" />

        {/* BLOB 2: Bottom Left */}
        <BackgroundBlob className="bottom-0 left-0 w-[20vw] md:w-[80vw] h-[20vw] md:h-[80vw] -translate-x-[40%] translate-y-[40%] text-black opacity-50 rotate-180" />
        
        {/* Cinematic Entrance */}
        <Preloader /> 
        
        {/* Navigation */}
        <Navbar />
        {/* Main Content Area */}
        <CartSidebar />
        <div className="relative z-10">
          {children}
        </div>

        <Suspense fallback={null}>
          <FacebookPixel />
        </Suspense>

        {/* Footer */}
        <SiteFooter />
        <WhatsAppWidget />
        
      </SmoothScroll>
    </>
  );
}