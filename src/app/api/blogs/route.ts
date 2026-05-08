import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/lib/models/blog";

// ==========================================
// GET: Fetch all blogs (For Admin Dashboard)
// ==========================================
export async function GET() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, blogs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// ==========================================
// POST: Create a new blog (From Admin Form)
// ==========================================
export async function POST(request: Request) {
  try {
    // 1. Get the data sent from the Admin Portal frontend
    const body = await request.json();
    const { title, slug, excerpt, content, category, image } = body;

    // 2. Basic Validation: Make sure required fields aren't empty
    if (!title || !slug || !content || !category || !image) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 3. Connect to MongoDB
    await connectToDatabase();

    // 4. Check if the slug already exists (Slugs MUST be unique)
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json(
        { success: false, message: "A blog with this URL slug already exists. Please change the title/slug." },
        { status: 409 } // 409 means Conflict
      );
    }

    // 5. Create and save the new blog
    const newBlog = await Blog.create({
      title,
      slug: slug.toLowerCase(), // Ensure slug is always lowercase
      excerpt,
      content,
      category,
      image,
    });

    // 6. Return success!
    return NextResponse.json(
      { success: true, message: "Blog published successfully!", blog: newBlog },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while publishing the blog" },
      { status: 500 }
    );
  }
}