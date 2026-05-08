import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb"; // Your existing DB connection
import Blog from "@/lib/models/blog";// Your Blog model

export const revalidate = 60; // Updates the page in the background every 60 seconds

export const metadata = {
    title: "Journal & Insights | Irtaza Printers",
    description: "Read the latest insights on tactile design and custom playing cards.",
};

export default async function BlogListingPage() {

    // 1. Connect to DB and fetch directly inside the component!
    await connectToDatabase();
    const rawPosts = await Blog.find({}).sort({ createdAt: -1 }).lean();

    // 2. Format the MongoDB data for Next.js
    const blogPosts = rawPosts.map(post => ({
        ...post,
        _id: post._id.toString(),
        date: new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        })
    }));

    return (
        <main className="min-h-screen bg-[#FDFBF7] pt-32 pb-24 px-4 sm:px-6 md:px-12">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-16 md:mb-24">
                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-500 mb-4">The Archive</p>
                    <h1 className="text-5xl md:text-7xl font-serif text-neutral-900 tracking-tight">Journal.</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                    {/* NOTICE: We added 'index' inside the map parameters! */}
                    {blogPosts.map((post, index) => (
                        <article key={post.slug} className="group cursor-pointer">
                            <Link href={`/blog/${post.slug}`}>

                                {/* Image Container */}
                                <div className="relative w-full h-[300px] md:h-[500px] mb-16 rounded-2xl overflow-hidden bg-neutral-200 shadow-sm">
                                    {post.image && (
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            // We removed h-auto and added h-full
                                            className="w-full h-full object-cover block"
                                            loading="eager"
                                        />
                                    )}
                                </div>

                                <div className="flex gap-4 items-center text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-3">
                                    <span>{post.category}</span>
                                    <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                                    <span>{post.date}</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-3">{post.title}</h2>
                                <p className="text-sm md:text-base text-neutral-600 mb-6 max-w-lg">{post.excerpt}</p>
                                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 group-hover:gap-4 transition-all">
                                    Read Article <ArrowRight size={14} />
                                </span>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}