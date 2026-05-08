"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

export default function DeleteOrderButton({ orderId }: { orderId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false); // Controls our beautiful custom popup
  const router = useRouter();

  // This function actually does the deleting
  const executeDelete = async () => {
    setIsDeleting(true);
    setShowModal(false); // Hide the popup immediately

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/orders");
        router.refresh();
      } else {
        alert("Failed to delete order.");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* 1. The Main Delete Button */}
      <button
        onClick={() => setShowModal(true)} // Opens the modal instead of browser alert
        disabled={isDeleting}
        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors disabled:opacity-50"
      >
        {isDeleting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Trash2 size={16} />
        )}
        {isDeleting ? "Deleting..." : "Delete Order"}
      </button>

      {/* 2. The Custom Premium Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          
          {/* Modal Box */}
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Warning Icon */}
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-5">
              <AlertTriangle size={24} />
            </div>
            
            <h3 className="text-xl font-serif text-neutral-900 mb-2">Delete Order?</h3>
            <p className="text-sm text-neutral-500 mb-8">
              Are you absolutely sure you want to delete this order? This action cannot be undone and will permanently remove the data.
            </p>
            
            {/* Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors flex justify-center"
              >
                Yes, Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}