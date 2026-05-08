import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { notFound } from "next/navigation";
import AnimatedProductPage from "./AnimatedProductPage";

// 1. This is the Server Component!
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Grab the slug from the URL
  const resolvedParams = await params;
  
  await connectToDatabase();
  
  // Find the exact product in MongoDB
  const product = await Product.findOne({ slug: resolvedParams.slug }).lean();

  // If someone types a bad URL (like /product/fake-item), show a 404 page
  if (!product) {
    return notFound();
  }

  // Convert MongoDB object to plain JSON for the Client Component
  const serializedProduct = JSON.parse(JSON.stringify(product));

  // Hand the live data to your GSAP animated component!
  return <AnimatedProductPage product={serializedProduct} />;
}