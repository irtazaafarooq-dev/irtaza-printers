import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, MapPin, Phone, Mail, User, CreditCard, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import OrderStatusUpdater from "./OrderStatusUpdater";
import DeleteOrderButton from "./DeleteOrderButton";

// 1. Change params type to a Promise
export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // 2. Await the params to unlock the ID!
  const { id } = await params;

  await connectToDatabase();

  // 3. Use the unwrapped 'id' directly
  const order = await Order.findById(id).lean();

  if (!order) {
    return notFound();
  }

  return (
    // CHANGED: Scaled padding for mobile screens
    <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-6 md:space-y-8">

      {/* HEADER */}
      {/* CHANGED: flex-col on mobile to prevent the delete button from squishing the title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 sm:gap-0">
        {/* CHANGED: items-start on mobile in case the title wraps */}
        <div className="flex items-start sm:items-center gap-3 md:gap-4">
          <Link href="/admin/orders" className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors shrink-0 mt-1 sm:mt-0">
            <ChevronLeft size={20} className="text-neutral-600 w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <div>
            {/* CHANGED: flex-wrap ensures the status badge drops down if it runs out of space */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <h1 className="text-xl sm:text-2xl font-serif text-neutral-900">Order #{order._id.toString().slice(-6).toUpperCase()}</h1>
              <OrderStatusUpdater
                orderId={order._id.toString()}
                currentStatus={order.status}
              />
            </div>
            <p className="text-[10px] sm:text-xs md:text-sm text-neutral-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
        </div>

        {/* ADD THE DELETE BUTTON HERE */}
        {/* CHANGED: align to the end on mobile to keep it neat */}
        <div className="self-end sm:self-auto">
          <DeleteOrderButton orderId={order._id.toString()} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

        {/* LEFT COLUMN: Items & Summary */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Items List */}
          <div className="bg-white border border-neutral-200 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-sm">
            <h2 className="text-[11px] md:text-sm font-bold uppercase tracking-widest text-neutral-900 mb-5 md:mb-6">Ordered Items</h2>
            <div className="space-y-5 md:space-y-6">
              {order.items.map((item: any, index: number) => (
                // CHANGED: Stack the text slightly better on mobile
                <div key={index} className="flex gap-3 md:gap-4 pb-5 md:pb-6 border-b border-neutral-100 last:border-0 last:pb-0">
                  {/* CHANGED: Slightly smaller image on mobile */}
                  <div className="relative w-16 h-20 md:w-20 md:h-24 bg-[#f4f2ed] rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-contain p-2" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs md:text-sm font-bold text-neutral-900 uppercase truncate">{item.title}</h3>
                    <p className="text-[10px] md:text-xs text-neutral-500 mt-0.5 md:mt-1 truncate">{item.variant.name}</p>
                    {item.addons.length > 0 && (
                      <div className="mt-1 md:mt-2 space-y-0.5 md:space-y-1">
                        {item.addons.map((addon: any, idx: number) => (
                          <p key={idx} className="text-[9px] md:text-[10px] text-neutral-400 uppercase tracking-wider truncate">+ {addon.name}</p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs md:text-sm font-bold text-neutral-900">Rs. {item.price.toLocaleString()}</p>
                    <p className="text-[10px] md:text-xs text-neutral-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="mt-6 pt-6 border-t border-neutral-200 space-y-3">
            {/* Subtotal */}
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Subtotal</span>
              <span>Rs. {order.subtotal?.toLocaleString()}</span>
            </div>

            {/* NEW: Coupon Discount */}
            {order.discount > 0 && (
              <div className="flex justify-between items-center text-sm font-medium text-green-600 bg-green-50 p-2 rounded-lg -mx-2 px-2 border border-green-100">
                <span className="flex items-center gap-1.5">
                  <Tag size={14} />
                  Coupon Used: <span className="font-bold">{order.couponCode}</span>
                </span>
                <span>- Rs. {order.discount?.toLocaleString()}</span>
              </div>
            )}

            {/* Shipping */}
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Shipping</span>
              <span>Rs. {order.shipping?.toLocaleString()}</span>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
              <span className="text-base font-bold text-neutral-900 uppercase tracking-widest">Total</span>
              <span className="text-xl font-serif text-neutral-900">Rs. {order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customer Details */}
        <div className="space-y-6 md:space-y-8">

          {/* Customer Info */}
          <div className="bg-white border border-neutral-200 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-sm">
            <h2 className="text-[11px] md:text-sm font-bold uppercase tracking-widest text-neutral-900 mb-5 md:mb-6">Customer Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User size={16} className="text-neutral-400 mt-0.5 md:w-[18px] md:h-[18px]" />
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider">Name</p>
                  <p className="text-xs md:text-sm font-medium text-neutral-900 truncate">{order.customer.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-neutral-400 mt-0.5 md:w-[18px] md:h-[18px]" />
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider">Email</p>
                  <p className="text-xs md:text-sm font-medium text-neutral-900 truncate">{order.customer.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-neutral-400 mt-0.5 md:w-[18px] md:h-[18px]" />
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider">Phone</p>
                  <p className="text-xs md:text-sm font-medium text-neutral-900 truncate">{order.customer.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-neutral-200 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-sm">
            <h2 className="text-[11px] md:text-sm font-bold uppercase tracking-widest text-neutral-900 mb-5 md:mb-6">Delivery Address</h2>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-neutral-400 mt-0.5 flex-shrink-0 md:w-[18px] md:h-[18px]" />
              <div>
                <p className="text-xs md:text-sm font-medium text-neutral-900 leading-relaxed">
                  {order.customer.address}<br />
                  {order.customer.city}<br />
                  {order.customer.country}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white border border-neutral-200 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-sm space-y-5 md:space-y-6">
            <div>
              <h2 className="text-[11px] md:text-sm font-bold uppercase tracking-widest text-neutral-900 mb-5 md:mb-6">Payment Method</h2>
              <div className="flex items-start md:items-center gap-3">
                <CreditCard size={16} className="text-neutral-400 mt-0.5 md:mt-0 md:w-[18px] md:h-[18px]" />
                <div>
                  <p className="text-xs md:text-sm font-bold text-neutral-900">
                    {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Transfer"}
                  </p>
                  <p className="text-[10px] md:text-xs text-neutral-500 mt-0.5">
                    {order.paymentMethod === "COD" ? "Collect payment at door." : "Verify receipt below."}
                  </p>
                </div>
              </div>
            </div>

            {/* If there is a payment proof image, display it! */}
            {order.paymentProof && (
              <div className="pt-4 border-t border-neutral-100">
                <h3 className="text-[10px] md:text-xs font-bold text-neutral-900 mb-3 uppercase tracking-wider">Payment Screenshot</h3>
                <a href={order.paymentProof} target="_blank" rel="noopener noreferrer" className="block relative w-full aspect-[9/16] max-h-80 md:max-h-96 rounded-lg overflow-hidden border border-neutral-200 hover:opacity-90 transition-opacity">
                  <Image src={order.paymentProof} alt="Payment Receipt" fill className="object-cover" />
                </a>
                <p className="text-[9px] md:text-[10px] text-neutral-400 mt-2 text-center">Click image to view full size</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}