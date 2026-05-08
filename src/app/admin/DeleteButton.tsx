"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false); // Controls our beautiful popup
  const router = useRouter();

  const confirmDelete = async () => {
    setShowModal(false); // Close the popup
    setIsDeleting(true); // Start the loading animation

    try {
      const res = await fetch(`/api/products/${id}`, { 
        method: "DELETE" 
      });

      if (res.ok) {
        router.refresh(); 
      } else {
        alert("Failed to delete product.");
        setIsDeleting(false);
      }
    } catch (error) {
      alert("A network error occurred.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* 1. The small trash icon in the table */}
      <button 
        onClick={() => setShowModal(true)} // Open our custom modal instead of browser alert
        disabled={isDeleting}
        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      >
        <Trash2 size={18} className={isDeleting ? "animate-pulse text-red-500" : ""} />
      </button>

      {/* 2. Our Custom Beautiful Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-sm p-4">
          
          {/* The Modal Box */}
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            
            <div className="flex flex-col items-center text-center">
              {/* Warning Icon */}
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-5">
                <AlertTriangle size={32} />
              </div>
              
              <h3 className="text-xl font-serif text-neutral-900 mb-2">Delete Product?</h3>
              <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
                Are you completely sure? This action cannot be undone and will permanently erase this product from the database.
              </p>
              
              {/* Action Buttons */}
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 px-4 bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                  Delete
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}