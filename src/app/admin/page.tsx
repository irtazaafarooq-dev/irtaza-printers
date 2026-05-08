import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import Link from "next/link";
import { Edit, Trash2, Plus } from "lucide-react";
import Image from "next/image";
import DeleteButton from "./DeleteButton";

// This forces Next.js to always fetch fresh data, not a cached version
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // 1. Connect to DB and fetch all products
  await connectToDatabase();
  const products = await Product.find({}).sort({ createdAt: -1 });

  return (
    // CHANGED: Reduced padding on mobile (p-4)
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">

      {/* Header */}
      {/* CHANGED: Stacked flex-col on mobile, flex-row on larger screens */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-1 md:mb-2">Products Overview</h1>
          <p className="text-neutral-500 text-xs md:text-sm">Manage your inventory, pricing, and bespoke packages.</p>
        </div>
        <Link
          href="/admin/add"
          // CHANGED: w-full on mobile to make the button easy to tap
          className="flex items-center justify-center w-full sm:w-auto gap-2 bg-neutral-900 text-white px-6 py-3 md:py-3 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-neutral-800 transition-colors"
        >
          <Plus size={16} /> New Product
        </Link>
      </div>

      {/* TailAdmin Style Data Table */}
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
        {/* Enables horizontal scrolling on mobile */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">

            {/* Table Head */}
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                {/* CHANGED: Adjusted padding and font sizes, added min-w/whitespace-nowrap to prevent squishing */}
                <th className="p-4 md:p-5 text-[10px] md:text-xs uppercase tracking-wider font-bold text-neutral-500 min-w-[200px]">Product</th>
                <th className="p-4 md:p-5 text-[10px] md:text-xs uppercase tracking-wider font-bold text-neutral-500 whitespace-nowrap">Base Price</th>
                <th className="p-4 md:p-5 text-[10px] md:text-xs uppercase tracking-wider font-bold text-neutral-500 whitespace-nowrap">Variants</th>
                <th className="p-4 md:p-5 text-[10px] md:text-xs uppercase tracking-wider font-bold text-neutral-500 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 md:p-10 text-center text-sm text-neutral-500">
                    No products found. Click "New Product" to add your first item.
                  </td>
                </tr>
              ) : (
                products.map((product: any) => {
                  // NEW LOGIC: Grab the first image from the array, or use a fallback grey box
                  const displayImage = (product.images && product.images.length > 0)
                    ? product.images[0]
                    : product.image || "https://via.placeholder.com/150?text=No+Image";

                  return (
                    <tr key={product._id.toString()} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">

                      {/* Image & Title */}
                      <td className="p-4 md:p-5">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                            <Image
                              src={displayImage}
                              alt={product.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <p className="font-bold text-sm md:text-base text-neutral-900 line-clamp-1">{product.title}</p>
                            <p className="text-[10px] md:text-xs text-neutral-500 mt-0.5 md:mt-1 truncate max-w-[120px] md:max-w-[200px]">{product.slug}</p>
                          </div>
                        </div>
                      </td>

                      {/* Base Price (Lowest Variant Price) */}
                      <td className="p-4 md:p-5">
                        <p className="font-medium text-xs md:text-sm text-neutral-900 whitespace-nowrap">
                          Rs. {product.basePrice ? product.basePrice.toLocaleString() : "0"}
                        </p>
                      </td>

                      {/* Stats */}
                      <td className="p-4 md:p-5">
                        <div className="flex gap-1.5 md:gap-2 flex-wrap md:flex-nowrap">
                          <span className="px-2 md:px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-[9px] md:text-xs font-bold whitespace-nowrap">
                            {product.variants?.length || 0} Pkgs
                          </span>
                          <span className="px-2 md:px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-[9px] md:text-xs font-bold whitespace-nowrap">
                            {product.addons?.length || 0} Addons
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 md:p-5">
                        <div className="flex items-center justify-end gap-2 md:gap-3">
                          <Link href={`/admin/edit/${product.slug}`} className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                            <Edit size={16} className="md:w-5 md:h-5" />
                          </Link>

                          {/* OUR NEW SMART DELETE BUTTON */}
                          <DeleteButton id={product._id.toString()} />

                        </div>
                      </td>

                    </tr>
                  )
                })
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}