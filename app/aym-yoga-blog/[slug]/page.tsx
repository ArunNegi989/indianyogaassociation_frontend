// ═══════════════════════════════════════════════════════
// FILE LOCATION: src/app/aym-yoga-blog/[slug]/page.tsx
// ═══════════════════════════════════════════════════════
// IMPORTANT: [slug] folder ke andar SIRF YEH EK page.tsx hona chahiye
// Dusra page.tsx delete karo

import SingleBlog from "@/components/singleblog/Singleblog.tsx";
import { allBlogs } from "@/lib/blogs";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allBlogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const blog = allBlogs.find((b) => b.slug === slug);
  if (!blog) return {};
  return {
    title: `${blog.title} | AYM Yoga Blog`,
    description: blog.excerpt,
  };
}

export default async function SingleBlogPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = allBlogs.find((b) => b.slug === slug);
  if (!blog) notFound();

  const relatedPosts = allBlogs
    .filter((b) => b.category === blog!.category && b.id !== blog!.id)
    .slice(0, 6);

  // ✅ Recent posts — latest 5 blogs (current blog exclude)
  const recentPosts = allBlogs
    .filter((b) => b.id !== blog!.id)
    .slice(0, 5);

  return (
    <SingleBlog
      blog={blog!}
      relatedPosts={relatedPosts}
      recentPosts={recentPosts}
    />
  );
}