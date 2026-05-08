"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle2, Image as ImageIcon, X } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";

export default function EditForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // --- PRE-FILL STATE WITH INITIAL DATA ---
  const [formData, setFormData] = useState({
    slug: initialData.slug || "",
    bgText: initialData.bgText || "",
    title: initialData.title || "",
    subtitle: initialData.subtitle || "",
    basePrice: initialData.basePrice || 0,
    paymentMethod: initialData.paymentMethod || "Any",
    isBestSeller: initialData.isBestSeller || false,
    customerNote: initialData?.customerNote || "",
  });

  const [images, setImages] = useState<string[]>(initialData.images || []);
  
  // Initialize features (fallback to one empty row if none exist)
  const [features, setFeatures] = useState(
    initialData.features?.length > 0 ? initialData.features : [{ label: "", value: "" }]
  );
  const [variants, setVariants] = useState(initialData.variants || []);
  const [addons, setAddons] = useState(initialData.addons || []);

  // --- HANDLERS ---
  // New Handlers for Features
  const handleAddFeature = () => setFeatures([...features, { label: "", value: "" }]);
  const handleRemoveFeature = (index: number) => setFeatures(features.filter((_: any, i: number) => i !== index));

  const handleAddVariant = () => setVariants([...variants, { name: "", price: 0 }]);
  const handleRemoveVariant = (index: number) => setVariants(variants.filter((_: any, i: number) => i !== index));

  const handleAddAddon = () => setAddons([...addons, { name: "", price: 0 }]);
  const handleRemoveAddon = (index: number) => setAddons(addons.filter((_: any, i: number) => i !== index));

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      setMessage("Error: Please upload at least one image.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    // ADDED features to the payload so it saves to the database!
    const productPayload = {
      ...formData,
      images,
      features, 
      variants,
      addons
    };

    try {
      const res = await fetch(`/api/products/${initialData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Product successfully updated!");
        router.refresh(); 
        setTimeout(() => {
            router.push("/admin"); 
        }, 1500);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // CHANGED: Reduced mobile padding to maximize screen space
    <div className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto">
      {/* CHANGED: Adjusted inner padding for mobile */}
      <div className="bg-white p-5 sm:p-8 md:p-12 rounded-2xl md:rounded-3xl shadow-sm border border-neutral-200">
        
        <div className="flex justify-between items-center mb-6 md:mb-8">
            {/* CHANGED: Scaled title for mobile */}
            <h1 className="text-2xl md:text-3xl font-serif text-neutral-900">Edit Product</h1>
            <button onClick={() => router.push("/admin")} className="text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors">
                Cancel
            </button>
        </div>

        {message && (
          <div className={`p-4 mb-6 md:mb-8 rounded-xl flex items-center gap-3 text-sm md:text-base ${message.includes("Error") ? "bg-red-50 text-red-700 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"}`}>
            {!message.includes("Error") && <CheckCircle2 size={20} className="shrink-0" />}
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10 md:space-y-12">
          
          {/* --- BASIC INFO --- */}
          <section className="space-y-4 md:space-y-6">
            <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-400 border-b pb-2">Basic Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1.5 md:mb-2">URL Slug</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase()})} className="w-full border border-neutral-300 rounded-lg p-3 text-sm md:text-base outline-none focus:border-neutral-900 bg-neutral-50 transition-colors" />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1.5 md:mb-2">Background Text</label>
                <input required type="text" value={formData.bgText} onChange={e => setFormData({...formData, bgText: e.target.value.toUpperCase()})} className="w-full border border-neutral-300 rounded-lg p-3 text-sm md:text-base outline-none focus:border-neutral-900 transition-colors" />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1.5 md:mb-2">Main Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-neutral-300 rounded-lg p-3 text-sm md:text-base outline-none focus:border-neutral-900 transition-colors" />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1.5 md:mb-2">Subtitle</label>
                <input required type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full border border-neutral-300 rounded-lg p-3 text-sm md:text-base outline-none focus:border-neutral-900 transition-colors" />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1.5 md:mb-2">Base Price (Rs.)</label>
                <input required type="number" min="0" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: parseFloat(e.target.value) || 0})} className="w-full border border-neutral-300 rounded-lg p-3 text-sm md:text-base outline-none focus:border-neutral-900 transition-colors" />
              </div>
              
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1.5 md:mb-2">Allowed Payment Method</label>
                <select 
                  value={formData.paymentMethod} 
                  onChange={e => setFormData({...formData, paymentMethod: e.target.value})} 
                  className="w-full border border-neutral-300 rounded-lg p-3 text-sm md:text-base outline-none focus:border-neutral-900 bg-white transition-colors"
                >
                  <option value="Any">Both (COD & Online Payment)</option>
                  <option value="COD">Cash on Delivery (COD) ONLY</option>
                  <option value="Online">Online Manual Payment ONLY</option>
                </select>
              </div>

              {/* --- CUSTOMER NOTE FIELD --- */}
              <div className="md:col-span-2">
                <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1.5 md:mb-2">
                  Important Customer Note (Optional)
                </label>
                <input 
                  type="text" 
                  value={formData.customerNote} 
                  onChange={e => setFormData({...formData, customerNote: e.target.value})} 
                  className="w-full border border-neutral-300 rounded-lg p-3 text-sm md:text-base outline-none focus:border-neutral-900 transition-colors bg-white" 
                  placeholder="e.g., Note: Send your photos through WhatsApp number..." 
                />
                <p className="text-[10px] md:text-xs text-neutral-500 mt-1">
                  This will be displayed prominently on the product page. Leave blank if not needed.
                </p>
              </div>

              {/* CHANGED: items-start prevents alignment issues if text wraps on mobile */}
              <div className="md:col-span-2 flex items-start sm:items-center gap-3 p-3 md:p-4 border border-neutral-200 rounded-lg bg-neutral-50 mt-2">
                <input 
                  type="checkbox" 
                  id="bestSellerEdit"
                  checked={formData.isBestSeller} 
                  onChange={e => setFormData({...formData, isBestSeller: e.target.checked})} 
                  className="w-5 h-5 mt-0.5 sm:mt-0 accent-neutral-900 cursor-pointer shrink-0"
                />
                <label htmlFor="bestSellerEdit" className="text-xs sm:text-sm font-bold text-neutral-900 cursor-pointer leading-tight">
                  Feature this product on the Homepage "Best Sellers" grid
                </label>
              </div>
            </div>
          </section>

          {/* --- MULTIPLE IMAGE UPLOAD --- */}
          <section className="space-y-4 md:space-y-6">
            <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-400 border-b pb-2">Product Images</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {images.map((imgUrl, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200 group bg-neutral-50">
                  <img src={imgUrl} alt={`Product ${idx}`} className="w-full h-full object-contain p-2" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-sm">
                    <X size={16} />
                  </button>
                </div>
              ))}

              <CldUploadWidget 
                uploadPreset="irtaza-products" 
                onSuccess={(result: any) => {
                  if (result.info && result.info.secure_url) {
                    setImages(prev => [...prev, result.info.secure_url]);
                  }
                }}
              >
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-300 rounded-xl text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 transition-colors bg-neutral-50">
                    <ImageIcon size={24} className="md:w-6 md:h-6 w-5 h-5" />
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Add Image</span>
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </section>

          {/* --- DYNAMIC FEATURES --- */}
          <section className="space-y-4 md:space-y-6">
            <div className="flex justify-between items-end border-b pb-2">
              <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-400">Features (Text Only)</h2>
              <button type="button" onClick={handleAddFeature} className="text-[10px] md:text-xs text-neutral-900 font-bold flex items-center gap-1 hover:underline"><Plus size={14}/> Add Feature</button>
            </div>
            <div className="space-y-3 md:space-y-0">
              {features.map((feature: any, index: number) => (
                // CHANGED: Flex-col on mobile creates a neat stacked card
                <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end p-3 sm:p-0 bg-neutral-50 sm:bg-transparent border border-neutral-200 sm:border-none rounded-xl sm:rounded-none">
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] md:text-xs font-medium text-neutral-500 mb-1">Heading (e.g., Material)</label>
                    <input required type="text" value={feature.label} onChange={e => { const newF = [...features]; newF[index].label = e.target.value; setFeatures(newF); }} className="w-full border border-neutral-300 rounded-lg p-3 text-sm bg-white" />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] md:text-xs font-medium text-neutral-500 mb-1">Detail (e.g., Premium Stock)</label>
                    <input required type="text" value={feature.value} onChange={e => { const newF = [...features]; newF[index].value = e.target.value; setFeatures(newF); }} className="w-full border border-neutral-300 rounded-lg p-3 text-sm bg-white" />
                  </div>
                  {features.length > 1 && (
                    <button type="button" onClick={() => handleRemoveFeature(index)} className="w-full sm:w-auto p-3 text-red-500 bg-white sm:bg-transparent border border-red-100 sm:border-none hover:bg-red-50 rounded-lg sm:mb-[2px] flex items-center justify-center gap-2">
                      <Trash2 size={18}/> <span className="sm:hidden text-xs font-bold">Remove</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* --- VARIANTS --- */}
          <section className="space-y-4 md:space-y-6">
            <div className="flex justify-between items-end border-b pb-2">
              <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-400">Variants (Radio Selects)</h2>
              <button type="button" onClick={handleAddVariant} className="text-[10px] md:text-xs text-neutral-900 font-bold flex items-center gap-1 hover:underline"><Plus size={14}/> Add Variant</button>
            </div>
            <div className="space-y-3 md:space-y-0">
              {variants.map((variant: any, index: number) => (
                // CHANGED: Stacked mobile cards
                <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end p-3 sm:p-0 bg-neutral-50 sm:bg-transparent border border-neutral-200 sm:border-none rounded-xl sm:rounded-none">
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] md:text-xs font-medium text-neutral-500 mb-1">Package Name</label>
                    <input required type="text" value={variant.name} onChange={e => { const newV = [...variants]; newV[index].name = e.target.value; setVariants(newV); }} className="w-full border border-neutral-300 rounded-lg p-3 text-sm bg-white" />
                  </div>
                  <div className="w-full sm:w-32">
                    <label className="block text-[10px] md:text-xs font-medium text-neutral-500 mb-1">Price (Rs)</label>
                    <input required type="number" value={variant.price} onChange={e => { const newV = [...variants]; newV[index].price = parseFloat(e.target.value); setVariants(newV); }} className="w-full border border-neutral-300 rounded-lg p-3 text-sm bg-white" />
                  </div>
                  <button type="button" onClick={() => handleRemoveVariant(index)} className="w-full sm:w-auto p-3 text-red-500 bg-white sm:bg-transparent border border-red-100 sm:border-none hover:bg-red-50 rounded-lg sm:mb-[2px] flex items-center justify-center gap-2">
                    <Trash2 size={18}/> <span className="sm:hidden text-xs font-bold">Remove</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* --- ADDONS --- */}
          <section className="space-y-4 md:space-y-6">
            <div className="flex justify-between items-end border-b pb-2">
              <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-400">Addons (Optional Checkboxes)</h2>
              <button type="button" onClick={handleAddAddon} className="text-[10px] md:text-xs text-neutral-900 font-bold flex items-center gap-1 hover:underline"><Plus size={14}/> Add Addon</button>
            </div>
            <div className="space-y-3 md:space-y-0">
              {addons.map((addon: any, index: number) => (
                // CHANGED: Stacked mobile cards
                <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end p-3 sm:p-0 bg-neutral-50 sm:bg-transparent border border-neutral-200 sm:border-none rounded-xl sm:rounded-none">
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] md:text-xs font-medium text-neutral-500 mb-1">Upgrade Name</label>
                    <input required type="text" value={addon.name} onChange={e => { const newA = [...addons]; newA[index].name = e.target.value; setAddons(newA); }} className="w-full border border-neutral-300 rounded-lg p-3 text-sm bg-white" />
                  </div>
                  <div className="w-full sm:w-32">
                    <label className="block text-[10px] md:text-xs font-medium text-neutral-500 mb-1">Extra Price (Rs)</label>
                    <input required type="number" value={addon.price} onChange={e => { const newA = [...addons]; newA[index].price = parseFloat(e.target.value); setAddons(newA); }} className="w-full border border-neutral-300 rounded-lg p-3 text-sm bg-white" />
                  </div>
                  <button type="button" onClick={() => handleRemoveAddon(index)} className="w-full sm:w-auto p-3 text-red-500 bg-white sm:bg-transparent border border-red-100 sm:border-none hover:bg-red-50 rounded-lg sm:mb-[2px] flex items-center justify-center gap-2">
                    <Trash2 size={18}/> <span className="sm:hidden text-xs font-bold">Remove</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* SUBMIT */}
          <button type="submit" disabled={isSubmitting} className="w-full bg-neutral-900 text-white py-4 md:py-5 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-colors active:scale-[0.99] shadow-lg shadow-neutral-900/20">
            {isSubmitting ? "Updating Database..." : "Update Product"}
          </button>

        </form>
      </div>
    </div>
  );
}