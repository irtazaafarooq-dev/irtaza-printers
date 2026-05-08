import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";

// This handles the POST request when you click "Save Product" in the Admin Portal
export async function POST(request: Request) {
  try {
    // 1. Open the vault door to MongoDB
    await connectToDatabase();

    // 2. Read the data sent from the form
    const data = await request.json();

    // 3. Create a new product in the database using our Blueprint (Schema)
    const newProduct = await Product.create(data);

    // 4. Send back a success message
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
    
  } catch (error: any) {
    console.error("Database Error:", error);
    // If they type a slug that already exists, MongoDB will throw an error.
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}