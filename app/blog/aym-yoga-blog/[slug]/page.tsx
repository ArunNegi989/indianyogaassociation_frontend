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

    return {
      title: `${data.data.title} | AYM Yoga Blog`,
      description: data.data.excerpt,
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