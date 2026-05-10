"use server";

import { Coupon } from "./models/Coupon"; // Adjust the path to wherever you saved the schema
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "./mongodb";

// 1. CREATE A COUPON (For Admin Portal)
export async function createCoupon(formData: FormData) {
  try {
    // Connect to DB (assuming you have a connectToDB function)
    await connectToDatabase(); 

    const code = formData.get("code");
    const discountType = formData.get("discountType");
    const discountValue = formData.get("discountValue");

    const newCoupon = new Coupon({
      code: code,
      discountType: discountType,
      discountValue: Number(discountValue),
      isActive: true,
    });

    await newCoupon.save();
    
    // Instantly update the Admin Portal using the trick we learned!
    revalidatePath("/admin/coupons"); 
    return { success: true, message: "Coupon Created!" };

  } catch (error) {
    return { success: false, error: "Failed to create coupon or code already exists." };
  }
}

// 2. DELETE A COUPON (For Admin Portal)
export async function deleteCoupon(id: string) {
  try {
    await Coupon.findByIdAndDelete(id);
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete coupon." };
  }
}

// 3. VALIDATE COUPON (For Customer Checkout Page)
export async function validateCouponCode(code: string) {
  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return { success: false, message: "Invalid or expired coupon code." };
    }

    // Check if it's expired based on date
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { success: false, message: "This coupon has expired." };
    }

    // Check usage limits
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { success: false, message: "This coupon has reached its usage limit." };
    }

    return { 
      success: true, 
      discountType: coupon.discountType, 
      discountValue: coupon.discountValue,
      couponId: coupon._id.toString()
    };

  } catch (error) {
    return { success: false, message: "Error validating coupon." };
  }
}

// 4. GET ALL COUPONS (For Admin Portal)
export async function getCoupons() {
  try {
    await connectToDatabase();
    // Fetches all coupons and sorts them by newest first
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    // Convert to standard JSON so Next.js client components can read it
    return JSON.parse(JSON.stringify(coupons)); 
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
    return [];
  }
}