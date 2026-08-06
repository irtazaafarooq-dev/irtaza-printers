import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AbandonedCart from "@/lib/models/AbandonedCart";
import { qstashClient } from "@/lib/qstash";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { playerId, cartItems, cartTotal } = await req.json();

    if (!playerId) {
      return NextResponse.json({ success: false, error: "Missing playerId" }, { status: 400 });
    }

    const existing = await AbandonedCart.findOne({ playerId });

    // Cancel any previously scheduled notification for this person — the cart just changed
    if (existing?.qstashMessageId) {
      try {
        await qstashClient.messages.delete(existing.qstashMessageId);
      } catch (err) {
        console.error("Failed to cancel previous QStash message (may have already fired):", err);
      }
    }

    // Schedule a fresh notification for exactly 30 minutes from now
    const { messageId } = await qstashClient.publishJSON({
      url: "https://irtazaprinters.com/api/notify-abandoned-cart",
      body: { playerId },
      delay: "30m",
    });

    await AbandonedCart.findOneAndUpdate(
      { playerId },
      { cartItems, cartTotal, notified: false, qstashMessageId: messageId, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to save cart" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { playerId } = await req.json();

    const existing = await AbandonedCart.findOne({ playerId });

    if (existing?.qstashMessageId) {
      try {
        await qstashClient.messages.delete(existing.qstashMessageId);
      } catch (err) {
        console.error("Failed to cancel QStash message (may have already fired):", err);
      }
    }

    await AbandonedCart.deleteOne({ playerId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to remove cart" }, { status: 500 });
  }
}