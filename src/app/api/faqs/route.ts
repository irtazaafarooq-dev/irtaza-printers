import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import FAQ from "@/lib/models/FAQ";

export async function GET() {
  try {
    await connectToDatabase();
    const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ success: true, faqs });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newFaq = await FAQ.create(body);
    return NextResponse.json({ success: true, faq: newFaq }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create FAQ" }, { status: 500 });
  }
}