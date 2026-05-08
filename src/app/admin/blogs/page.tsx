"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Loader2, FileText, AlertTriangle } from "lucide-react"; // Added AlertTriangle

interface Blog {
  _id: string;
  title: string;
  category: string;
  image: string;
  createdAt: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // NEW: State to control the beautiful Delete Modal
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs");
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: This function actually deletes the blog when they click "Yes, Delete" in the modal
  const confirmDelete = async () => {
    if (!blogToDelete) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/blogs/${blogToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBlogs(blogs.filter((blog) => blog._id !== blogToDelete));
        setBlogToDelete(null); // Close the modal
      } else {
        alert("Failed to delete the blog.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-12 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-2">Journals & Blogs</h1>
            <p className="text-sm text-neutral-500">Manage your published editorial content.</p>
          </div>
          
          <Link 
            href="/admin/blogs/new" 
            className="inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors"
          >
            <Plus size={18} />
            Write New Journal
          </Link>
        </div>

        {/* Blogs Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
              <Loader2 size={32} className="animate-spin mb-4" />
              <p>Loading journals...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-neutral-400 text-center px-4">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="text-lg text-neutral-900 font-medium mb-2">No journals found</p>
              <p className="text-sm max-w-sm">You haven't published any blogs yet. Click "Write New Journal" to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-4">Cover</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date Published</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-neutral-50 transition-colors group">
                      
                      <td className="px-6 py-4">
                        <div className="relative w-16 h-12 rounded overflow-hidden bg-neutral-100 border border-neutral-200">
                          {blog.image ? (
                            <Image src={blog.image} alt={blog.title} fill className="object-cover" />
                          ) : (
                            <FileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-300" size={20} />
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 font-medium text-neutral-900 truncate max-w-[200px] md:max-w-[300px]">
                        {blog.title}
                      </td>
                      
                      <td className="px-6 py-4 text-neutral-500">
                        <span className="bg-neutral-100 px-3 py-1 rounded-full text-xs font-medium">
                          {blog.category}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 text-neutral-500">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        {/* NEW: Just opens the modal, doesn't delete instantly */}
                        <button 
                          onClick={() => setBlogToDelete(blog._id)} 
                          className="inline-flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ========================================= */}
      {/* BEAUTIFUL CUSTOM DELETE MODAL             */}
      {/* ========================================= */}
      {blogToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8 animate-in zoom-in-95 duration-200">
            
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-5">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
            
            <h3 className="text-xl font-serif text-neutral-900 mb-2">Delete Journal</h3>
            <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
              Are you completely sure you want to delete this journal entry? This action cannot be undone, and it will be permanently removed from your website.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setBlogToDelete(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}