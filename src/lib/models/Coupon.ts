import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // Forces "SUMMER20" even if they type "summer20"
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"], // percentage = 20%, fixed = Rs. 500 off
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiryDate: {
      type: Date,
      required: false, // Optional: if you want the coupon to expire
    },
    usageLimit: {
      type: Number,
      required: false, // Optional: e.g., "Only for the first 50 customers"
    },
    usedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// If the model already exists, use it. Otherwise, create a new one.
export const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);