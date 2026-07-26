import mongoose, { Schema, models } from "mongoose";

const OfferSchema = new Schema(
  {
    thresholdOffer: {
      enabled: { type: Boolean, default: false },
      minOrderAmount: { type: Number, default: 0 },
      type: { type: String, enum: ["freeShipping", "discount"], default: "freeShipping" },
      discountValue: { type: Number, default: 0 }, // percentage, only used if type === "discount"
    },
    popupOffer: {
      enabled: { type: Boolean, default: false },
      discountPercentage: { type: Number, default: 10 },
      delaySeconds: { type: Number, default: 1 },
    },
  },
  { timestamps: true }
);

const Offer = models.Offer || mongoose.model("Offer", OfferSchema);
export default Offer;