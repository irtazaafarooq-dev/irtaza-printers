import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/lib/models/blog";

// ==========================================
// DELETE: Remove a blog by ID
// ==========================================
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } // NEXT.JS 15 FIX: params is a Promise
) {
  try {
    // NEXT.JS 15 FIX: We must 'await' the params to get the ID
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ success: false, message: "Blog ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Find the blog and delete it
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Blog deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete blog" },
      { status: 500 }
    );
  }
}