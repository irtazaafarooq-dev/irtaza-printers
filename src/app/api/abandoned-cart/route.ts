import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AbandonedCart from "@/lib/models/AbandonedCart";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { playerId, cartItems, cartTotal } = await req.json();

    if (!playerId) {
      return NextResponse.json({ success: false, error: "Missing playerId" }, { status: 400 });
    }

    await AbandonedCart.findOneAndUpdate(
      { playerId },
      { cartItems, cartTotal, notified: false, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to save cart" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { playerId } = await req.json();
    await AbandonedCart.deleteOne({ playerId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to remove cart" }, { status: 500 });
  }
}