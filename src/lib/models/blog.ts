import mongoose, { Schema, Document } from "mongoose";

// 1. Define the TypeScript interface for our Blog Document
export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Create the Mongoose Schema
const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required for the URL"],
      unique: true, // Crucial: Ensures no two blogs have the same URL!
      trim: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: [true, "A short excerpt is required for SEO and listing pages"],
      maxLength: [300, "Excerpt cannot exceed 300 characters"],
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required (e.g., Craftsmanship, Design)"],
    },
    image: {
      type: String,
      required: [true, "Cover image URL is required"],
    },
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' dates
  }
);

// 3. Export the model (Handling Next.js hot-reloading safely)
const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;