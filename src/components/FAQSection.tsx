import { connectToDatabase } from "@/lib/mongodb";
import FAQ from "@/lib/models/FAQ";
import FAQAccordion from "@/components/FAQAccordion";

export const dynamic = 'force-dynamic';

export default async function FAQSection() {
  await connectToDatabase();
  const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 }).lean();

  if (faqs.length === 0) return null;

  const plainFaqs = JSON.parse(JSON.stringify(faqs));

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 max-w-3xl mx-auto">
      <h2 className="text-2xl md:text-4xl font-serif text-neutral-900 text-center mb-8 md:mb-12">
        Frequently Asked Questions
      </h2>
      <FAQAccordion faqs={plainFaqs} />
    </section>
  );
}