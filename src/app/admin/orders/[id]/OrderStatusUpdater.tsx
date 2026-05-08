"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function OrderStatusUpdater({ 
  orderId, 
  currentStatus 
}: { 
  orderId: string; 
  currentStatus: string; 
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh the page data in the background to update the UI
        router.refresh(); 
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <select
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider outline-none cursor-pointer appearance-none border-2 border-transparent hover:border-neutral-200 transition-all ${
          currentStatus === "Pending" ? "bg-neutral-100 text-neutral-700" :
          currentStatus === "Processing" ? "bg-purple-100 text-purple-700" :
          currentStatus === "Shipped" ? "bg-blue-100 text-blue-700" :
          currentStatus === "Delivered" ? "bg-green-100 text-green-700" :
          "bg-red-100 text-red-700"
        } ${isUpdating ? "opacity-50" : "opacity-100"}`}
      >
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      
      {/* Show a tiny spinner while updating */}
      {isUpdating && <Loader2 size={16} className="animate-spin text-neutral-400" />}
    </div>
  );
}