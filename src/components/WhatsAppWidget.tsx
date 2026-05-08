"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function WhatsAppWidget() {
  // Your WhatsApp Business Number (Must include country code, NO plus sign)
  const phoneNumber = "923084445261"; 
  
  // The default message that appears in their chat box when they click
  const message = "Hi Irtaza Printers, I need some help!";
  
  // Create the official WhatsApp API link
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Link 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      // Position fixed to bottom-right, with a high z-index so it's always on top
      className="fixed bottom-6 right-6 z-[99] flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-in fade-in zoom-in slide-in-from-bottom-6"
    >
      {/* We use a custom SVG for the exact WhatsApp logo shape! */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="32" 
        height="32" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="fill-current stroke-none"
      >
        <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.06-.297-.15-1.265-.476-2.405-1.485-.888-.781-1.487-1.745-1.66-2.04-.175-.295-.021-.454.128-.603.135-.135.298-.344.446-.518.15-.175.201-.298.301-.498.098-.198.048-.372-.025-.521-.075-.148-.673-1.62-.922-2.216-.241-.579-.487-.501-.673-.51l-.573-.009c-.198 0-.521.074-.794.372-.271.298-1.042 1.016-1.042 2.476 0 1.46 1.066 2.873 1.215 3.072.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12.002 2C6.477 2 2 6.477 2 12.002c0 1.756.456 3.444 1.325 4.965L2 22l5.176-1.309A9.957 9.957 0 0012.002 22c5.523 0 10-4.477 10-10 0-5.525-4.477-10-10-10zm0 18.396c-1.483 0-2.935-.386-4.212-1.117l-.302-.173-3.136.793.805-3.085-.192-.303A8.39 8.39 0 013.606 12C3.606 7.375 7.376 3.606 12 3.606S20.394 7.375 20.394 12 16.626 20.396 12.002 20.396z"/>
      </svg>
    </Link>
  );
}