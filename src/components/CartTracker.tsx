"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";

export default function CartTracker() {
  const cart = useCartStore((state) => state.cart);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const OneSignal = (window as any).OneSignal;
        const playerId = OneSignal?.User?.PushSubscription?.id;
        if (!playerId) return; // they haven't allowed notifications yet

        if (cart.length === 0) {
          await fetch("/api/abandoned-cart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerId }),
          });
          return;
        }

        const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        await fetch("/api/abandoned-cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId, cartItems: cart, cartTotal }),
        });
      } catch (error) {
        console.error("Cart tracking failed:", error);
      }
    }, 2000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [cart]);

  return null;
}