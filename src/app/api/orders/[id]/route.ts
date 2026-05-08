import { NextResponse } from "next/server";
import {  connectToDatabase } from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    // Unwrap params for Next.js 15
    const { id } = await params; 
    
    // Get the new status from the frontend
    const body = await req.json();
    const { status } = body;

    // Find the order and update its status
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Returns the updated document
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 });

  } catch (error) {
    console.error("Failed to update order status:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}

// Add this right below your existing PATCH function!
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    // Unwrap params for Next.js 15
    const { id } = await params; 
    
    // Find the order by ID and completely remove it from the database
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Order deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Failed to delete order:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}