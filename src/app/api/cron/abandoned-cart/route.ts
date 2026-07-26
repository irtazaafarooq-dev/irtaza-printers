import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AbandonedCart from "@/lib/models/AbandonedCart";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const thirtyMinutesAgo = new Date(Date.now() - 1 * 60 * 1000);

    const abandonedCarts = await AbandonedCart.find({
      notified: false,
      lastUpdated: { $lte: thirtyMinutesAgo },
      cartItems: { $ne: [] },
    });

    for (const cart of abandonedCarts) {
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
    }

    return NextResponse.json({ success: true, notified: abandonedCarts.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Cron job failed" }, { status: 500 });
  }
}