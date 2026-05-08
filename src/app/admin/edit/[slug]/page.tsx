import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import EditForm from "./EditForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // 1. Connect to DB and find the specific product
  await connectToDatabase();
  const product = await Product.findOne({ slug: resolvedParams.slug });

  // 2. If someone types a bad URL, show a 404 page
  if (!product) {
    return notFound();
  }

  // 3. Convert complex MongoDB object to a plain JavaScript object
  const plainProduct = JSON.parse(JSON.stringify(product));

  // 4. Pass the data to our interactive Client Component form
  return <EditForm initialData={plainProduct} />;
}