import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import ShopGrid from "@/components/ShopGrid";

// Force Next.js to always fetch the latest products from the database
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  await connectToDatabase();
  
  // Magic: The empty brackets {} mean "Find Everything!"
  // .sort({ _id: -1 }) ensures your newest products appear at the top of the page.
  const allProducts = await Product.find({}).sort({ _id: -1 }).lean();
  
  // Convert complex MongoDB objects to plain data for the Client Component
  const serializedProducts = JSON.parse(JSON.stringify(allProducts));

  return (
    <main className="min-h-screen bg-[#FDFBF7] pt-20">
      <ShopGrid products={serializedProducts} />
    </main>
  );
}