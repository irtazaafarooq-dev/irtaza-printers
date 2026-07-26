"use client";

import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

export default function AdminOffersPage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [thresholdOffer, setThresholdOffer] = useState({
    enabled: false,
    minOrderAmount: 0,
    type: "freeShipping",
    discountValue: 0,
  });

  const [popupOffer, setPopupOffer] = useState({
    enabled: false,
    discountPercentage: 10,
    delaySeconds: 1,
  });

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await fetch("/api/offers");
        const data = await res.json();
        if (data.success) {
          setThresholdOffer(data.offer.thresholdOffer);
          setPopupOffer(data.offer.popupOffer);
        }
      } catch (error) {
        setMessage("Failed to load offers.");
      } finally {
        setLoading(false);
      }
    };
    fetchOffer();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/offers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thresholdOffer, popupOffer }),
      });
      const data = await res.json();
      setMessage(data.success ? "Offers updated successfully!" : `Error: ${data.error}`);
    } catch (error) {
      setMessage("Failed to connect to the server.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-sm text-neutral-500">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif text-neutral-900">Offers & Discounts</h1>
        <p className="text-xs md:text-sm text-neutral-500 mt-1">Manage checkout incentives.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${message.includes("Error") ? "bg-red-50 text-red-700 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"}`}>
          {!message.includes("Error") && <CheckCircle2 size={20} className="shrink-0" />}
          {message}
        </div>
      )}

      {/* THRESHOLD OFFER CARD */}
      <div className="bg-white p-5 sm:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-neutral-200 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-serif text-neutral-900">Order Threshold Offer</h2>
            <p className="text-xs md:text-sm text-neutral-500 mt-1">Reward customers who spend above a set amount.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" checked={thresholdOffer.enabled} onChange={e => setThresholdOffer({ ...thresholdOffer, enabled: e.target.checked })} className="sr-only peer" />
            <div className="w-11 h-6 bg-neutral-200 rounded-full peer peer-checked:bg-neutral-900 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
        </div>

        <div className={`space-y-4 ${!thresholdOffer.enabled ? "opacity-40 pointer-events-none" : ""}`}>
          <div>
            <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1.5">Minimum Order Amount (Rs.)</label>
            <input type="number" min="0" value={thresholdOffer.minOrderAmount} onChange={e => setThresholdOffer({ ...thresholdOffer, minOrderAmount: parseFloat(e.target.value) || 0 })} className="w-full border border-neutral-300 rounded-lg p-3 text-sm outline-none focus:border-neutral-900 transition-colors" />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1.5">Reward Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setThresholdOffer({ ...thresholdOffer, type: "freeShipping" })} className={`p-3 rounded-lg border-2 text-xs md:text-sm font-bold transition-colors ${thresholdOffer.type === "freeShipping" ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 text-neutral-500"}`}>
                Free Shipping
              </button>
              <button type="button" onClick={() => setThresholdOffer({ ...thresholdOffer, type: "discount" })} className={`p-3 rounded-lg border-2 text-xs md:text-sm font-bold transition-colors ${thresholdOffer.type === "discount" ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 text-neutral-500"}`}>
                % Discount on Total
              </button>
            </div>
          </div>

          {thresholdOffer.type === "discount" && (
            <div>
              <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1.5">Discount Percentage (%)</label>
              <input type="number" min="0" max="100" value={thresholdOffer.discountValue} onChange={e => setThresholdOffer({ ...thresholdOffer, discountValue: parseFloat(e.target.value) || 0 })} className="w-full border border-neutral-300 rounded-lg p-3 text-sm outline-none focus:border-neutral-900 transition-colors" />
            </div>
          )}
        </div>
      </div>

      {/* POPUP OFFER CARD */}
      <div className="bg-white p-5 sm:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-neutral-200 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-serif text-neutral-900">Checkout Popup Offer</h2>
            <p className="text-xs md:text-sm text-neutral-500 mt-1">Ask for email/phone in exchange for a discount, shown on the checkout page.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" checked={popupOffer.enabled} onChange={e => setPopupOffer({ ...popupOffer, enabled: e.target.checked })} className="sr-only peer" />
            <div className="w-11 h-6 bg-neutral-200 rounded-full peer peer-checked:bg-neutral-900 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${!popupOffer.enabled ? "opacity-40 pointer-events-none" : ""}`}>
          <div>
            <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1.5">Discount Percentage (%)</label>
            <input type="number" min="0" max="100" value={popupOffer.discountPercentage} onChange={e => setPopupOffer({ ...popupOffer, discountPercentage: parseFloat(e.target.value) || 0 })} className="w-full border border-neutral-300 rounded-lg p-3 text-sm outline-none focus:border-neutral-900 transition-colors" />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1.5">Delay Before Showing (seconds)</label>
            <input type="number" min="0" value={popupOffer.delaySeconds} onChange={e => setPopupOffer({ ...popupOffer, delaySeconds: parseFloat(e.target.value) || 0 })} className="w-full border border-neutral-300 rounded-lg p-3 text-sm outline-none focus:border-neutral-900 transition-colors" />
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={isSaving} className="w-full bg-neutral-900 text-white py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-colors active:scale-[0.99] shadow-lg shadow-neutral-900/20">
        {isSaving ? "Saving..." : "Save Offers"}
      </button>
    </div>
  );
}