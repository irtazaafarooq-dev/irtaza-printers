"use client";

import { useState, useEffect } from "react";
import { X, Tag, CheckCircle2 } from "lucide-react";

export default function DiscountPopup({
  discountPercentage,
  delaySeconds,
  onApply,
}: {
  discountPercentage: number;
  delaySeconds: number;
  onApply: (contact: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("discountPopupDismissed") === "true") return;
    const timer = setTimeout(() => setVisible(true), delaySeconds * 1000);
    return () => clearTimeout(timer);
  }, [delaySeconds]);

  const closePopup = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem("discountPopupDismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("access_key", "85352725-01aa-4752-9456-78e4326862a1");
    formData.append("subject", "New Checkout Discount Popup Lead!");
    formData.append("contact", contact);

    try {
      await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
    } catch (error) {
      console.error("Web3Forms submission failed:", error);
    } finally {
      setIsSuccess(true);
      sessionStorage.setItem("discountPopupDismissed", "true");
      onApply(contact);
      setIsSubmitting(false);
    }
  };

  if (!visible || dismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={closePopup} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors">
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-lg font-serif text-neutral-900 mb-1">Discount Applied!</h3>
            <p className="text-sm text-neutral-500">Your {discountPercentage}% discount has been added to your total.</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-5">
              <Tag size={24} />
            </div>
            <h3 className="text-xl font-serif text-neutral-900 mb-2">Get {discountPercentage}% Off!</h3>
            <p className="text-sm text-neutral-500 mb-6">
              Leave your email or phone number and we'll apply an instant {discountPercentage}% discount to your order.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input required type="text" placeholder="Email or phone number" value={contact} onChange={e => setContact(e.target.value)} className="w-full p-3.5 text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-neutral-900 transition-colors" />
              <button type="submit" disabled={isSubmitting} className="w-full bg-neutral-900 text-white py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50">
                {isSubmitting ? "Applying..." : `Claim ${discountPercentage}% Discount`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}