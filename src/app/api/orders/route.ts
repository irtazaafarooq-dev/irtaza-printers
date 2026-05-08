import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    
    // Grab the data sent from the checkout page
    const body = await req.json();
    
    // Create and save the new order to MongoDB
    const newOrder = await Order.create(body);

    // Return a success message with the order ID
    return NextResponse.json({ success: true, orderId: newOrder._id }, { status: 201 });

  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}