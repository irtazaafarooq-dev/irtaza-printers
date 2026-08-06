import mongoose, { Schema, models } from "mongoose";

const AbandonedCartSchema = new Schema(
  {
    playerId: { type: String, required: true, unique: true },
    cartItems: { type: Array, default: [] },
    cartTotal: { type: Number, default: 0 },
    notified: { type: Boolean, default: false },
    qstashMessageId: { type: String, default: null },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const AbandonedCart = models.AbandonedCart || mongoose.model("AbandonedCart", AbandonedCartSchema);
export default AbandonedCart;