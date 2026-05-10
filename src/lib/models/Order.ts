import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, default: "Pakistan" }
  },
  items: [{
    productId: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String },
    variant: { type: mongoose.Schema.Types.Mixed },
    addons: { type: Array, default: [] },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  paymentMethod: { type: String, required: true, enum: ["COD", "Online"] },
  paymentProof: { type: String },
  
  // --- PRICING DATA ---
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },         // <-- NEW!
  couponCode: { type: String, default: null },    // <-- NEW!
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
  
  status: { 
    type: String, 
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending" 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);