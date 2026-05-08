import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import WhyChooseUs from "@/components/WhyChooseUs";
import Reviews from "@/components/Reviews";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
// import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {

  await connectToDatabase();
  const bestSellers = await Product.find({ isBestSeller: true }).lean();
  const serializedProducts = JSON.parse(JSON.stringify(bestSellers));
  
  return (
    <div>
      <Hero bestSellers={serializedProducts} />
      <ProductGrid/>
      <WhyChooseUs />
      <Reviews />
    </div>
  );
}