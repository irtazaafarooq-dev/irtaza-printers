"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  
  // THE FIX: We cast the component to 'any' to bypass React 19's strict type checking
  const LenisComponent = ReactLenis as any;

  return (
    <LenisComponent 
      root 
      options={{
        lerp: 0.07, // The "tightness" of the smooth scroll. Lower = smoother/heavier
        duration: 1.5, // How long the momentum lasts
        smoothWheel: true, 
      }}
    >
      {children}
    </LenisComponent>
  );
}