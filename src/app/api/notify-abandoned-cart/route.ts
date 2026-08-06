import { NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { connectToDatabase } from "@/lib/mongodb";
import AbandonedCart from "@/lib/models/AbandonedCart";

async function handler(req: Request) {
  try {
    await connectToDatabase();
    const { playerId } = await req.json();

    const cart = await AbandonedCart.findOne({ playerId });

    // If it's gone (they bought or cleared it) or already notified, do nothing
    if (!cart || cart.notified) {
      return NextResponse.json({ success: true, skipped: true });
    }

    await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        include_subscription_ids: [cart.playerId],
        headings: { en: "You left something behind! 🛒" },
        contents: { en: `Your cart is waiting — Rs. ${cart.cartTotal.toLocaleString()} worth of items. Complete your order now!` },
        url: "https://irtazaprinters.com/checkout",
      }),
    });

    cart.notified = true;
    await cart.save();

    return NextResponse.json({ success: true, notified: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to notify" }, { status: 500 });
  }
}

export const POST = verifySignatureAppRouter(handler);