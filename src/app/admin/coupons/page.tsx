"use client";

import { useState, useEffect } from "react";
import { createCoupon, deleteCoupon, getCoupons } from "@/lib/actions"; // Adjust path if needed
import { Trash2, Tag, Percent, PlusCircle, CheckCircle2, AlertCircle, X } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  // NEW: Toast Notification State
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  // Fetch coupons when the page loads
  const loadCoupons = async () => {
    setIsFetching(true);
    const data = await getCoupons();
    setCoupons(data);
    setIsFetching(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  // NEW: Helper function to show a beautiful toast
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ visible: true, message, type });
    // Auto-hide after 3.5 seconds
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3500);
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await createCoupon(formData);

    if (result.success) {
      showToast("Coupon created successfully!", "success"); // CHANGED FROM alert()
      form.reset(); // Clear the form
      loadCoupons(); // Refresh the list
    } else {
      showToast(result.error || "Failed to create coupon.", "error"); // CHANGED FROM alert()
    }

    setIsLoading(false);
  };

  // Handle Deleting
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    
    await deleteCoupon(id);
    showToast("Coupon deleted.", "success");
    loadCoupons(); // Refresh the list after deleting
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8 md:p-12 font-sans text-neutral-900 relative">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">Discount Codes</h1>
          <p className="text-neutral-500">Create and manage checkout coupons for your customers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: THE FORM --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 sticky top-10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <PlusCircle size={20} className="text-neutral-400" />
                Create New Coupon
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Code Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Coupon Code</label>
                  <input 
                    type="text" 
                    name="code" 
                    required 
                    placeholder="e.g. SUMMER20" 
                    className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none uppercase"
                  />
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Discount Type</label>
                  <select 
                    name="discountType" 
                    className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Discount Value</label>
                  <input 
                    type="number" 
                    name="discountValue" 
                    required 
                    placeholder="e.g. 20" 
                    className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-neutral-900 text-white font-bold text-sm tracking-widest uppercase rounded-lg p-4 hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Generating..." : "Create Coupon"}
                </button>
              </form>
            </div>
          </div>

          {/* --- RIGHT COLUMN: THE LIST --- */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Tag size={20} className="text-neutral-400" />
                Active Coupons
              </h2>

              {isFetching ? (
                <p className="text-neutral-500 text-sm">Loading coupons...</p>
              ) : coupons.length === 0 ? (
                <div className="text-center py-10 bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
                  <p className="text-neutral-500 text-sm">No coupons created yet. Create your first one!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {coupons.map((coupon) => (
                    <div key={coupon._id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl hover:border-neutral-400 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${coupon.discountType === 'percentage' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                          {coupon.discountType === 'percentage' ? <Percent size={20} /> : <span className="font-bold font-serif text-lg leading-none">₨</span>}
                        </div>
                        <div>
                          <p className="font-bold text-lg tracking-tight">{coupon.code}</p>
                          <p className="text-sm text-neutral-500">
                            {coupon.discountType === 'percentage' 
                              ? `${coupon.discountValue}% off total order` 
                              : `Rs. ${coupon.discountValue} off total order`
                            }
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDelete(coupon._id)}
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* --- NEW: CUSTOM ANIMATED TOAST NOTIFICATION --- */}
      <div 
        className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ease-in-out transform ${
          toast.visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
        }`}
      >
        <div className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-sm font-medium border ${
          toast.type === "success" 
            ? "bg-white text-neutral-900 border-green-200 shadow-green-900/10" 
            : "bg-white text-neutral-900 border-red-200 shadow-red-900/10"
        }`}>
          {toast.type === "success" ? (
            <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 size={18} className="text-green-600" /></div>
          ) : (
            <div className="bg-red-100 p-1 rounded-full"><AlertCircle size={18} className="text-red-600" /></div>
          )}
          
          <span className="pr-4">{toast.message}</span>
          
          <button 
            onClick={() => setToast((prev) => ({ ...prev, visible: false }))} 
            className="text-neutral-400 hover:text-neutral-900 transition-colors border-l border-neutral-200 pl-3"
          >
            <X size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}