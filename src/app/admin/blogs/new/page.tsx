"use client";

import { useState } from "react";
import { ArrowLeft, Save, Loader2, CheckCircle2, AlertCircle, ImagePlus } from "lucide-react";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";

export default function NewBlogPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    image: "", 
    excerpt: "",
    content: "", 
  });

  // Automatically generate a slug from the title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") 
      .replace(/(^-|-$)+/g, ""); 

    setFormData({ ...formData, title, slug: generatedSlug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    if (!formData.image) {
      setStatus({ type: "error", message: "Please upload a cover image first." });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: "Blog published successfully!" });
        setFormData({ title: "", slug: "", category: "", image: "", excerpt: "", content: "" });
      } else {
        setStatus({ type: "error", message: data.message || "Failed to publish blog." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/blogs" className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
              <ArrowLeft size={20} className="text-neutral-600" />
            </Link>
            <h1 className="text-2xl font-serif text-neutral-900">Write a New Journal</h1>
          </div>
        </div>

        {/* Status Messages */}
        {status.type === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3">
            <CheckCircle2 size={20} />
            <p>{status.message}</p>
          </div>
        )}
        {status.type === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} />
            <p>{status.message}</p>
          </div>
        )}

        {/* The Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="space-y-2 text-sm">
              <label className="font-semibold text-neutral-900">Post Title</label>
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                placeholder="e.g. Styling Dummy Books..."
              />
            </div>

            {/* URL Slug */}
            <div className="space-y-2 text-sm">
              <label className="font-semibold text-neutral-900">URL Slug</label>
              <input 
                required
                type="text" 
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-neutral-500"
                placeholder="e.g. styling-dummy-books"
              />
            </div>

            {/* Category */}
            <div className="space-y-2 text-sm">
              <label className="font-semibold text-neutral-900">Category</label>
              <select 
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all appearance-none"
              >
                <option value="" disabled>Select a category...</option>
                <option value="Interior Design">Interior Design</option>
                <option value="Craftsmanship">Craftsmanship</option>
                <option value="Company News">Company News</option>
                <option value="Inspiration">Inspiration</option>
              </select>
            </div>

            {/* Cover Image Upload (Cloudinary) */}
            <div className="space-y-2 text-sm">
              <label className="font-semibold text-neutral-900">Cover Image</label>
              
              <div className="flex items-center gap-4">
                <CldUploadWidget 
                  uploadPreset="irtaza-products" 
                  onSuccess={(result: any) => {
                    setFormData({ ...formData, image: result.info.secure_url });
                  }}
                >
                  {({ open }) => (
                    <button 
                      type="button" 
                      onClick={() => open()} 
                      className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-3 rounded-lg font-medium transition-colors border border-neutral-200"
                    >
                      <ImagePlus size={18} />
                      {formData.image ? "Change Image" : "Upload Image"}
                    </button>
                  )}
                </CldUploadWidget>

                {formData.image && (
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    Image Uploaded!
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Excerpt */}
          <div className="space-y-2 text-sm">
            <label className="font-semibold text-neutral-900">Short Excerpt (For Listing Page)</label>
            <textarea 
              required
              maxLength={300}
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all resize-none"
              placeholder="A brief 1-2 sentence summary of the article..."
            />
            <p className="text-xs text-neutral-400 text-right">{formData.excerpt.length}/300</p>
          </div>

          {/* Main Content */}
          <div className="space-y-2 text-sm">
            <label className="font-semibold text-neutral-900 flex justify-between">
              <span>Main Content</span>
              <span className="font-normal text-neutral-400">Supports HTML formatting (e.g. &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;)</span>
            </label>
            <textarea 
              required
              rows={15}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all font-mono text-sm"
              placeholder="<p>Start writing your article here...</p>"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-neutral-100 flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-neutral-900 text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSubmitting ? "Publishing..." : "Publish Journal"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}