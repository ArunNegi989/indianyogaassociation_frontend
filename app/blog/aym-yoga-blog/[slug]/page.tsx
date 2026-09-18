import SingleBlog from "@/components/singleblog/Singleblog";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

function normalise(raw: any) {
  const origin = process.env.NEXT_PUBLIC_API_URL ?? "";
  const image = raw.coverImage
    ? raw.coverImage.startsWith("http")
      ? raw.coverImage
      : `${origin}${raw.coverImage}`
    : "";

  const ogImage = raw.ogImage
    ? raw.ogImage.startsWith("http")
      ? raw.ogImage
      : `${origin}${raw.ogImage}`
    : image;

  return {
    id: raw._id ?? raw.id ?? "",
    slug: raw.slug ?? "",
    title: raw.title ?? "",
    excerpt: raw.excerpt ?? "",
    date: raw.date
      ? new Date(raw.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "",
    author: raw.author || undefined,
    category: raw.category ?? "",
    coverImage: image,
    tags: raw.tags ?? [],
    content: raw.content ?? [],
    // SEO fields
    metaTitle: raw.metaTitle || raw.title || "",
    metaDescription: raw.metaDescription || raw.excerpt || "",
    canonicalUrl: raw.canonicalUrl || "",
    ogTitle: raw.ogTitle || raw.title || "",
    ogDescription: raw.ogDescription || raw.excerpt || "",
    ogImage: ogImage,
  };
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${BASE}/blogs/get-by-slug/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );
    const data = await res.json();
    if (!data.success || !data.data) return {};

    const blog = data.data;
    const origin = process.env.NEXT_PUBLIC_API_URL ?? "";

    // Normalize image URLs
    const coverImage = blog.coverImage
      ? blog.coverImage.startsWith("http")
        ? blog.coverImage
        : `${origin}${blog.coverImage}`
      : "";

    const ogImage = blog.ogImage
      ? blog.ogImage.startsWith("http")
        ? blog.ogImage
        : `${origin}${blog.ogImage}`
      : coverImage;

    const metaTitle = blog.metaTitle || blog.title;
    const metaDescription = blog.metaDescription || blog.excerpt;
    const canonicalUrl =
      blog.canonicalUrl ||
      `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${blog.slug}`; 

    return {
      title: `${metaTitle}`, 
      description: metaDescription,
      canonical: canonicalUrl,
      openGraph: {
        title: blog.ogTitle || metaTitle,
        description: blog.ogDescription || metaDescription,
        images: ogImage
          ? [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: blog.ogTitle || metaTitle,
              },
            ]
          : undefined,
        type: "article",
        publishedTime: blog.date ? new Date(blog.date).toISOString() : undefined,
        modifiedTime: blog.updatedAt
          ? new Date(blog.updatedAt).toISOString()
          : undefined,
        authors: blog.author ? [blog.author] : undefined,
        tags: blog.tags || [],
        siteName: "Indian Yoga Blog",
        locale: "en-IN",
      },
      twitter: {
        card: ogImage ? "summary_large_image" : "summary",
        title: blog.ogTitle || metaTitle,
        description: blog.ogDescription || metaDescription,
        images: ogImage ? [ogImage] : undefined,
        site: "@IndianYoga",
        creator: "@IndianYoga", 
      },
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION || "",
      },
    };
  } catch {
    return {};
  }
}

export default async function SingleBlogPage({ params }: PageProps) {
  const { slug } = await params;

  let blog: ReturnType<typeof normalise>;

  try {
    const res = await fetch(
      `${BASE}/blogs/get-by-slug/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );

    if (!res.ok) return notFound();

    const data = await res.json();
    if (!data.success || !data.data) return notFound();

    blog = normalise(data.data);
  } catch {
    return notFound();
  }

  let allBlogs: ReturnType<typeof normalise>[] = [];

  try {
    const res = await fetch(`${BASE}/blogs/get-all`, { cache: "no-store" });
    const data = await res.json();

    allBlogs = (data.data ?? [])
      .filter((b: any) => b.status === "Published")
      .map(normalise);
  } catch {}

  const relatedPosts = allBlogs
    .filter((b) => b.category === blog.category && b.id !== blog.id)
    .slice(0, 6);

  const recentPosts = allBlogs.filter((b) => b.id !== blog.id).slice(0, 5);

  return (
    <SingleBlog
      blog={blog}
      relatedPosts={relatedPosts}
      recentPosts={recentPosts}
    />
  );
}