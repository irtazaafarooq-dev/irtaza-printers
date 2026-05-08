import { connectToDatabase } from "@/lib/mongodb"; // Adjust this import if your DB file is named differently!
import Order from "@/lib/models/Order";
import Link from "next/link";
import { Eye } from "lucide-react";

// This forces Next.js to fetch fresh data every time you load the page
export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  // 1. Connect to the database
  await connectToDatabase();

  // 2. Fetch all orders and sort by newest first
  const orders = await Order.find().sort({ createdAt: -1 }).lean();

  return (
    // CHANGED: Reduced padding on mobile
    <div className="p-4 sm:p-6 md:p-10 lg:p-12 max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          {/* CHANGED: Scaled header for mobile */}
          <h1 className="text-2xl md:text-3xl font-serif text-neutral-900">Orders</h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">Manage your customer orders and shipments.</p>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white border border-neutral-200 rounded-xl md:rounded-2xl overflow-hidden shadow-sm">
        {/* Ensures horizontal scrolling on small devices */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500">
              <tr>
                {/* CHANGED: Adjusted padding and typography for mobile headers */}
                <th className="p-4 md:p-5 text-[11px] md:text-sm font-medium">Order ID</th>
                <th className="p-4 md:p-5 text-[11px] md:text-sm font-medium">Customer</th>
                <th className="p-4 md:p-5 text-[11px] md:text-sm font-medium">Items & Packages</th>
                <th className="p-4 md:p-5 text-[11px] md:text-sm font-medium">Payment</th>
                <th className="p-4 md:p-5 text-[11px] md:text-sm font-medium">Total</th>
                <th className="p-4 md:p-5 text-[11px] md:text-sm font-medium">Status</th>
                <th className="p-4 md:p-5 text-[11px] md:text-sm font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 md:p-10 text-center text-sm text-neutral-500">
                    No orders found yet. Time to do some marketing!
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order._id.toString()} className="hover:bg-neutral-50 transition-colors">
                    
                    {/* Order ID & Date */}
                    <td className="p-4 md:p-5">
                      <p className="font-bold text-neutral-900 uppercase tracking-wider text-[10px]">
                        #{order._id.toString().slice(-6)}
                      </p>
                      <p className="text-[10px] md:text-xs text-neutral-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-PK', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </td>

                    {/* Customer Info */}
                    <td className="p-4 md:p-5">
                      <p className="font-medium text-xs md:text-sm text-neutral-900">{order.customer.name}</p>
                      <p className="text-[10px] md:text-xs text-neutral-500 mt-0.5">{order.customer.city}</p>
                    </td>

                    {/* Items List (Keeps whitespace-normal so text wraps nicely if column is wide enough) */}
                    <td className="p-4 md:p-5 whitespace-normal min-w-[200px] md:min-w-[250px]">
                      <div className="space-y-3">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="text-[11px] md:text-xs leading-relaxed">
                            {/* Quantity and Title */}
                            <p className="font-bold text-neutral-900">
                              {item.quantity}x {item.title}
                            </p>
                            
                            {/* Package / Variant Name */}
                            {item.variant?.name && (
                              <p className="text-neutral-600 mt-0.5">
                                <span className="font-medium text-neutral-400">Pkg:</span> {item.variant.name}
                              </p>
                            )}
                            
                            {/* Addons List */}
                            {item.addons?.length > 0 && (
                              <p className="text-neutral-500 mt-0.5">
                                <span className="font-medium text-neutral-400">Addons:</span> {item.addons.map((addon: any) => addon.name).join(", ")}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Payment Method */}
                    <td className="p-4 md:p-5">
                      <span className={`px-2 md:px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${
                        order.paymentMethod === "COD" 
                          ? "bg-amber-100 text-amber-700" 
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {order.paymentMethod}
                      </span>
                    </td>

                    {/* Total Price */}
                    <td className="p-4 md:p-5">
                      <p className="font-bold text-xs md:text-sm text-neutral-900">
                        Rs. {order.total.toLocaleString()}
                      </p>
                      <p className="text-[9px] md:text-[10px] text-neutral-500 mt-0.5">
                        {order.items.length} item(s)
                      </p>
                    </td>

                    {/* Order Status Badge */}
                    <td className="p-4 md:p-5">
                      <span className={`px-2 md:px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${
                        order.status === "Pending" ? "bg-neutral-100 text-neutral-600" :
                        order.status === "Processing" ? "bg-purple-100 text-purple-700" :
                        order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                        order.status === "Delivered" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700" // Cancelled
                      }`}>
                        {order.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 md:p-5 text-right">
                      <Link 
                        href={`/admin/orders/${order._id.toString()}`} 
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors inline-flex"
                      >
                        <Eye size={18} className="md:w-5 md:h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}