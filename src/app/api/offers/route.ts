import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Offer from "@/lib/models/Offer";

export async function GET() {
  try {
    await connectToDatabase();
    let offer = await Offer.findOne();
    if (!offer) offer = await Offer.create({});
    return NextResponse.json({ success: true, offer });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch offers" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    let offer = await Offer.findOne();
    if (!offer) {
      offer = await Offer.create(body);
    } else {
      offer = await Offer.findByIdAndUpdate(offer._id, body, { new: true });
    }
    return NextResponse.json({ success: true, offer });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update offers" }, { status: 500 });
  }
}