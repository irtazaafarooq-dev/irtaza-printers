import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/lib/models/blog";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

// Next.js 15: params is a Promise
type Props = {
    params: Promise<{ slug: string }>;
};

// ==========================================
// 1. DYNAMIC SEO METADATA (For Google)
// ==========================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params; // Next.js 15 await

    await connectToDatabase();
    const post = await Blog.findOne({ slug }).lean();

    if (!post) {
        return { title: "Article Not Found | Irtaza Printers" };
    }

    return {
        title: `${post.title} | Journal | Irtaza Printers`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.image],
            type: "article",
        },
    };
}

// ==========================================
// 2. THE MAIN ARTICLE PAGE
// ==========================================
export default async function SingleBlogPage({ params }: Props) {
    const { slug } = await params; // Next.js 15 await

    // Fetch the specific post from the database
    await connectToDatabase();
    const post = await Blog.findOne({ slug }).lean();

    // If the URL is wrong, show Next.js 404 page
    if (!post) {
        notFound();
    }

    // Format the date beautifully
    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <main className="min-h-screen bg-[#FDFBF7] pt-32 pb-24 px-4 sm:px-6 md:px-12">

            {/* 3. GOOGLE SCHEMA MARKUP (Invisible to users, read by Google) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": post.title,
                        "image": [post.image],
                        "datePublished": post.createdAt,
                        "author": { "@type": "Organization", "name": "Irtaza Printers" }
                    })
                }}
            />

            <article className="max-w-[800px] mx-auto">

                {/* Back Button */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors mb-12"
                >
                    <ArrowLeft size={16} /> Back to Journal
                </Link>

                {/* Article Header */}
                <div className="text-center mb-12">
                    <p className="text-xs uppercase tracking-widest text-neutral-500 font-bold mb-4">
                        {post.category}
                    </p>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-neutral-900 mb-6 leading-tight md:leading-tight">
                        {post.title}
                    </h1>
                    <p className="text-neutral-500 text-sm font-medium">
                        Published on {formattedDate}
                    </p>
                </div>

                {/* Big Cover Image */}
                {/* We replaced aspect-[16/9] with explicit heights: h-[300px] on phones, h-[500px] on computers */}
                {/* Big Cover Image - Bulletproof Version */}
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

                {/* The Main Content 
          We use dangerouslySetInnerHTML to safely inject the HTML you wrote in the Admin Portal 
        */}
                {/* The Main Content */}
        <div 
          className="
            prose prose-neutral max-w-none 
            prose-base md:prose-lg lg:prose-xl 
            text-neutral-800 leading-relaxed 
            [&>h2]:font-serif [&>h2]:text-2xl md:[&>h2]:text-3xl [&>h2]:mt-10 md:[&>h2]:mt-12 [&>h2]:mb-4 md:[&>h2]:mb-6 
            [&>p]:mb-6 
            [&>img]:rounded-xl [&>img]:w-full [&>img]:my-8
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

            </article>
        </main>
    );
}