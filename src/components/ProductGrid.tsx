import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import AnimatedGrid from "./AnimatedGrid";

// Force dynamic fetching so it updates immediately when you change best sellers
export const dynamic = "force-dynamic";

export default async function ProductGrid() {
  await connectToDatabase();
  
  // Magic: Only fetch products where isBestSeller is true!
  const bestSellers = await Product.find({ isBestSeller: true }).lean();
  
  // Convert complex MongoDB objects to plain data for the Client Component
  const serializedProducts = JSON.parse(JSON.stringify(bestSellers));

  return <AnimatedGrid products={serializedProducts} />;
}