"use client";

import { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

export default function DeleteFAQButton({
  faqId,
  onDeleted,
}: {
  faqId: string;
  onDeleted: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const executeDelete = async () => {
    setIsDeleting(true);
    setShowModal(false);

    try {
      const response = await fetch(`/api/faqs/${faqId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDeleted(); // tells the parent list to refresh
      } else {
        alert("Failed to delete FAQ.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setShowModal(true)}
        disabled={isDeleting}
        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      >
        {isDeleting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Trash2 size={16} />
        )}
      </button>

      {/* Custom Premium Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-5">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-xl font-serif text-neutral-900 mb-2">Delete FAQ?</h3>
            <p className="text-sm text-neutral-500 mb-8">
              Are you absolutely sure you want to delete this FAQ? This action cannot be undone and will remove it from your homepage immediately.
            </p>

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