import mongoose from "mongoose";

// This is the strict Blueprint for what a Product must look like in our database
const productSchema = new mongoose.Schema({
  // The URL name (e.g., "bespoke-linen-cards")
  slug: { type: String, required: true, unique: true },
  
  // Basic Info
  bgText: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  basePrice: { type: Number, required: true, default: 0 },
  paymentMethod: { type: String, enum: ["Any", "COD", "Online"], default: "Any" },
  customerNote: { type: String, default: "" },
  isBestSeller: { type: Boolean, default: false },
  
  // CHANGED: Now accepts an array of multiple image URLs from Cloudinary
  images: [{ type: String, required: true }],
  
  // Features (Material, Finish, etc.)
 features: [{
    label: { type: String, required: true },
    value: { type: String, required: true }
  }],

  // MAIN PACKAGES (Radio Buttons) - User must pick one
  variants: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],

  // OPTIONAL UPGRADES (Checkboxes) - User can pick multiple
  addons: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }]
}, { 
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt' dates!
});

// Next.js hot-reloading fix: 
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;