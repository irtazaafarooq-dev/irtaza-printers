import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import FAQ from "@/lib/models/FAQ";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const body = await req.json();
    const updated = await FAQ.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, faq: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update FAQ" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    await FAQ.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete FAQ" }, { status: 500 });
  }
}