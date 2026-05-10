"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, PlusCircle, LogOut, Package, Menu, X, FileText } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Helper to close sidebar when a link is clicked on mobile
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-neutral-50 font-sans z-[99999] relative overflow-hidden">

      {/* --- MOBILE TOP BAR --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-neutral-900 border-b border-neutral-800 z-40 flex items-center justify-between px-4 shadow-md">
        <div className="flex flex-col leading-none">
          <span className="text-xl font-black tracking-tighter italic text-white">IRTAZA</span>
          <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-neutral-500 mt-1">Admin</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-neutral-300 hover:text-white p-2 focus:outline-none"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- MOBILE BACKDROP OVERLAY --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside
        className={`w-64 bg-neutral-900 text-neutral-300 flex flex-col fixed h-full z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >

        {/* Desktop Branding */}
        <div className="p-8 border-b border-neutral-800 hidden md:block">
          <div className="flex flex-col leading-none">
            <span className="text-3xl font-black tracking-tighter italic text-white">IRTAZA</span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-500 mt-2">Admin Portal</span>
          </div>
        </div>

        {/* Mobile Branding (Inside Sidebar) */}
        <div className="p-6 border-b border-neutral-800 md:hidden flex justify-between items-center">
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black tracking-tighter italic text-white">IRTAZA</span>
          </div>
          <button onClick={closeSidebar} className="text-neutral-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4 px-4">Menu</p>

          <Link href="/admin" onClick={closeSidebar} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-800 hover:text-white transition-colors">
            <LayoutDashboard size={18} /> <span className="text-sm font-medium">Dashboard</span>
          </Link>

          <Link href="/admin/add" onClick={closeSidebar} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-800 hover:text-white transition-colors">
            <PlusCircle size={18} /> <span className="text-sm font-medium">Add Product</span>
          </Link>

          <Link href="/admin/orders" onClick={closeSidebar} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-800 hover:text-white transition-colors">
            <Package size={18} /> <span className="text-sm font-medium">Orders</span>
          </Link>

          <Link href="/admin/blogs" onClick={closeSidebar} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-800 hover:text-white transition-colors">
            <FileText size={18} /> <span className="text-sm font-medium">Blogs</span>
          </Link>

         <Link href="/admin/coupons" onClick={closeSidebar} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-800 hover:text-white transition-colors">
            <FileText size={18} /> <span className="text-sm font-medium">Coupon</span>
          </Link>
        </nav>

        

        {/* Footer actions */}
        <div className="p-4 border-t border-neutral-800">
          <Link href="/" className="flex items-center gap-3 p-3 rounded-xl text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors">
            <LogOut size={18} /> <span className="text-sm font-medium">Back to Website</span>
          </Link>
        </div>

      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      {/* pt-16 pushes content down so it's not hidden behind the mobile top bar */}
      <main className="flex-1 h-full overflow-y-auto w-full md:ml-64 pt-16 md:pt-0">
        {children}
      </main>

    </div>
  );
}